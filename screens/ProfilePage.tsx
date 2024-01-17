import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Dimensions, ScrollView, Alert } from "react-native";
import { Color, FontSize, FontFamily, Border } from "../GlobalStyles";
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { useAccount } from 'wagmi'
import { W3mButton } from "@web3modal/wagmi-react-native";
import LottieView from "lottie-react-native";

interface Profile {
  name: string;
  address: string;
  gender: string;
  age: number;
  email: string;
  phoneNumber: string;
  picture: string;
}

const dimensions = Dimensions.get('window');
const Width = dimensions.width;


function ProfilePage({ profile }: { profile: Profile }): JSX.Element {
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const { address, isConnected } = useAccount()
  const navigation = useNavigation();

  useEffect(() => {
    // Initialize Firestore instance
    const db = firestore();

    if (isConnected) {
      // Create a query to find the user document by address
      const userQuery = db.collection("Voters").where("address", "==", address);

      // Fetch user document
      userQuery.get()
        .then(querySnapshot => {
          // Check if document exists
          if (!querySnapshot.empty) {
            // Get the user data from the first document
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();

            // Update the profile data state with the fetched user data
            setProfileData(userData);

          } else {
            console.log("No user found with that address!");
          }
        })
        .catch(error => {
          console.error(error);
          Alert.alert(
            'Error',
            'An error occurred while fetching your profile data. Please try again later.',
            [
              {
                text: '',
                onPress: () => {
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
        });

    }
  }, [isConnected]);


  if (!isConnected) {
    return (
      <View style={styles.profilePage}>
        <Pressable style={styles.backButton} onPress={() => navigation.navigate('Dashboard')}>
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
        <View style={styles.profileHeader}>
          <Text style={styles.Profile}>Personal Info</Text>
        </View>
        <Text style={styles.name}>Please connect to Blockchain Wallet</Text>
        <Text></Text>
        <W3mButton />
      </View>
    );
  }


  if (!profileData) {
    return (
      <View style={styles.profilePage}>
        <Pressable style={styles.backButton} onPress={() => navigation.navigate('Dashboard')}>
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
        <View style={styles.profileHeader}>
          <Text style={styles.Profile}>Personal Info</Text>
        </View>
        <View>
          <LottieView source={require('../assets/loading.json')}
            style={{ aspectRatio: 1, width: "15%", alignSelf: "center", marginTop: "10%" }}
            autoPlay
            loop
          />
        </View>
        <Text style={styles.name}>Please wait</Text>
      </View>
    );
  }

  return (
    <View style={styles.profilePage}>
      <View style={styles.profileHeader}>
        <Text style={styles.Profile}>Personal Info</Text>
      </View>
      <Pressable style={styles.backButton} onPress={() => navigation.navigate('Dashboard')}>
        <Text style={styles.backButtonText}>Back</Text>
      </Pressable>
      <View style={styles.profileItem}>
        <ScrollView style={{ height: "100%" }}>
          <Image
            source={{ uri: profileData.picture }}
            style={{ width: Width * 0.4, aspectRatio: 1, marginBottom: '5%', alignSelf: 'center' }}
          />
          <View style={[styles.Box, styles.shadowProp]}>
            <Text style={styles.name}>{profileData.name}</Text>
          </View>
          <View style={[styles.Box, styles.shadowProp]}>
            <Text style={styles.email}>{profileData.email}</Text>
          </View>
          <View style={[styles.Box, styles.shadowProp]}>
            <Text style={styles.gender}>{profileData.gender}</Text>
          </View>
          <View style={[styles.Box, styles.shadowProp]}>
            <Text style={styles.address}>{profileData.phoneNumber}</Text>
          </View>
          <View style={[styles.Box, styles.shadowProp]}>
            <Text style={styles.address}>{profileData.address}</Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profilePage: {
    backgroundColor: Color.lightcyan,
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 1,
    flex: 1,
    overflow: "hidden",
    paddingVertical: 30,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },

  name: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
    color: "#325264"
  },
  address: {
    fontSize: 16,
    color: "#777",
    alignSelf: "center",
  },
  gender: {
    fontSize: 16,
    color: "#777",
    alignSelf: "center",
  },
  email: {
    fontSize: 16,
    color: "#777",
    alignSelf: "center",
  },
  backButton: {
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
  backButtonText: {
    color: Color.white,
    fontFamily: FontFamily.interExtrabold,
    fontSize: FontSize.size_s,
    textAlign: "center",
  },
  Box: {
    backgroundColor: Color.white,
    width: "90%",
    alignSelf: "center",
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: Border.br_xl,
    margin: 20,
  },
  shadowProp: {
    elevation: 7,
    shadowColor: '#52006A',
  },
  profileHeader: {
    top: "0%",
    backgroundColor: Color.darkcyan,
    width: "100%",
    height: "8%",
    position: "absolute",
    alignSelf: "center",
    overflow: "hidden",
  },
  Profile: {
    alignSelf: "center",
    fontSize: FontSize.size_6xl,
    fontWeight: "800",
    fontFamily: FontFamily.interExtrabold,
    color: Color.white,
    position: "absolute",
    marginTop: 25,
  },
  profileItem: {
    top: "15%",
    width: "100%",
    height: "73%",
    position: "absolute",
    alignSelf: "center",
    overflow: "hidden",
    padding: 0,
  },
});

export default ProfilePage;
