import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, Pressable, TouchableOpacity, ScrollView, } from 'react-native';
import { FontSize, FontFamily, Color, Border } from "../GlobalStyles";
import { useNavigation } from "@react-navigation/native";
import { usePrepareContractWrite, useContractWrite } from 'wagmi';
import { abi } from '../abi'
import { useAccount } from 'wagmi'
import { collection, getDocs, getFirestore } from "firebase/firestore";
import firestore from "@react-native-firebase/firestore";
import LottieView from 'lottie-react-native';

interface Option {
  id: number;
  name: string;
}

const VotingPage: React.FC = () => {
  const navigation = useNavigation();
  const { isConnected } = useAccount()
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const docRef = firestore().collection('Election').doc('electionDetail');
  const [fieldNameData, setFieldNameData] = useState<bigint>(BigInt(0));

  useEffect(() => {
    docRef.get().then((doc) => {
      if (doc.exists) {
        setFieldNameData(doc.data()?.currentElection);
      } else {
        console.log("No such document!");
      }
    });
  }, []);

  const handleVote = (optionId: number) => {
    setSelectedOption(optionId);
  };

  useEffect(() => {

    if (isConnected) {

      const db = getFirestore();

      const candidatesRef = collection(db, "Candidate");
      getDocs(candidatesRef)
        .then((querySnapshot) => {
          const candidatesData = querySnapshot.docs.map((doc) => ({
            id: doc.get("id"),
            name: doc.get("name"),
          }));
          setOptions(candidatesData.map((candidate) => ({
            id: parseInt(candidate.id),
            name: candidate.name,
          })));
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching candidates:", error);
        });
    }
  }, [isConnected]);

  const chosenOption = options.find((option) => option.id === selectedOption)?.name;
  const chosenOptionName = chosenOption as string;
  const { config } = usePrepareContractWrite({
    address: "0x23014E1D38391C52c7b3e458D3f170D19249CAE8",
    abi: abi,
    functionName: "vote",
    args: [fieldNameData, chosenOptionName],
    onError(error) {
      console.log('Error', error)
      Alert.alert(
        'Error',
        'Voter has already voted',
        [
          {
            text: '',
            onPress: async () => {
              navigation.navigate("Dashboard");
            },
          },
          {
            text: 'OK',
            onPress: async () => {
              navigation.navigate("Dashboard");
            },
          },
        ]
      );
    },
  });

  const {
    data: voteData,
    isLoading: isLoadingVote,
    isSuccess: isSuccessVote,
    write: vote,
    isError: isErrorVote,
    isIdle,
  } = useContractWrite(config);

  const VoteData = JSON.stringify(voteData);
  const hexValue = voteData?.hash;

  const confirmVote = async () => {
    try {
      await vote?.();

    } catch (isErrorVote) {
      console.error("Error confirming vote:", isErrorVote);
      Alert.alert(
        'Error',
        'Error occuered while voting. Please try again.',
        [
          {
            text: '',
          },
          {
            text: 'OK',
            onPress: async () => {
              navigation.navigate("Eligibility");
            },
          },
        ]
      );
    }
  };

  const navigateToConfirmedPage = () => {
    navigation.navigate("VotingConfirmed", { hexValue });
  };


  return (
    <View style={styles.votingPage}>
      <View style={styles.votingHeader}>
        <Text style={styles.votingHeaderText}>Voting</Text>
      </View>
      <View style={styles.votingItem}>
        <Text style={styles.title}>Vote your favorite option</Text>
        <View
          style={{
            borderBottomColor: 'black',
            borderBottomWidth: StyleSheet.hairlineWidth,
            marginTop: 10,
            marginBottom: 20,
          }}
        />
        <ScrollView style={{ height: "100%" }}>
          {<View>
            {loading && (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View>
                  <LottieView source={require('../assets/loading.json')}
                    style={{ aspectRatio: 1, width: "15%", alignSelf: "center", marginTop: "40%" }}
                    autoPlay
                    loop
                  />
                </View>
                <Text style={{ marginTop: 15 }}>Please wait</Text>
              </View>
            )}

            <View>
              {options.map((option) => (
                <View style={{ alignSelf: 'center' }}>
                  <TouchableOpacity
                    key={option.id}
                    style={[styles.option, selectedOption === option.id && styles.selectedOption]}
                    onPress={() => handleVote(option.id)}
                    disabled={isSuccessVote}
                  >
                    <Text style={styles.voteCount}>Candidate:</Text>
                    <Text style={styles.voteCount}>{option.name}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

          </View>}
        </ScrollView>
        <View
          style={{
            borderBottomColor: 'black',
            borderBottomWidth: StyleSheet.hairlineWidth,
            marginTop: 10,
            marginBottom: 20,
          }}
        />
        <Button
          onPress={confirmVote}
          title={`Confirm vote for ${chosenOptionName || "..."}`}
          disabled={!selectedOption || isSuccessVote}
          color="#4BDA53"
        />
        <View
          style={{
            marginTop: 10,
            marginBottom: 20,
          }}
        />
        {isLoadingVote && <Text style={{ color: '#f80709', alignSelf: 'center' }}>Check Wallet</Text>}
        {isSuccessVote && <Text style={{ color: Color.darkslategray, alignSelf: 'center' }}>Transaction Hash: {hexValue}</Text>}
      </View>

      <Pressable
        onPress={navigateToConfirmedPage}
        disabled={!isSuccessVote}
        style={[styles.confirmButton, {
          backgroundColor: isSuccessVote ? Color.green : "#808080",
        }]}
      >
        <Text style={styles.nextPage}>Proceed to Confirmation Page</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 10,
    color: Color.darkslategray,
  },
  nextPage: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Color.white,

  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    borderRadius: 10,
    width: 300,
    height: 100,
    backgroundColor: Color.white,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 20,
  },
  voteCount: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
    color: Color.darkcyan,
  },
  votingHeader: {
    top: "0%",
    backgroundColor: Color.darkcyan,
    width: "100%",
    height: "8%",
    position: "absolute",
    alignSelf: "center",
    overflow: "hidden",
  },
  votingHeaderText: {
    alignSelf: "center",
    fontSize: FontSize.size_6xl,
    fontWeight: "800",
    fontFamily: FontFamily.interExtrabold,
    color: Color.white,
    position: "absolute",
    marginTop: 25,
  },
  votingPage: {
    backgroundColor: Color.lightcyan,
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 1,
    flex: 1,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  confirmButton: {
    backgroundColor: Color.red,
    borderRadius: Border.br_xl,
    paddingHorizontal: 5,
    paddingVertical: 10,
    alignSelf: "center",
    position: "absolute",
    bottom: "10%",
    width: 300,
    height: 42,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: Color.darkslategray,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  selectedOption: {
    backgroundColor: 'lightblue',
  },
  votingItem: {
    top: "15%",
    backgroundColor: Color.lightcyan,
    width: "90%",
    height: "65%",
    position: "absolute",
    alignSelf: "center",
    overflow: "hidden",
    padding: 10,
  },
});

export default VotingPage;




