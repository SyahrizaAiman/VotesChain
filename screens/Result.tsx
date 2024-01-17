import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Pressable, ScrollView, Dimensions } from "react-native";
import { FontSize, FontFamily, Color, Border } from "../GlobalStyles";
import { useNavigation } from "@react-navigation/native";
import { useContractRead, sepolia } from 'wagmi'
import { SelectList } from 'react-native-dropdown-select-list'
import firestore from '@react-native-firebase/firestore';
import { BarChart, LineChart, PieChart, PopulationPyramid } from "react-native-gifted-charts";
import { abi } from '../abi'
import LottieView from "lottie-react-native";

const Result = () => {
    const navigation = useNavigation();
    const [chosenElectionId, setChosenElectionId] = useState('0');
    const electionIdBigInt = BigInt(chosenElectionId);
    const electionCollection = firestore().collection('All Election');
    const [elections, setElections] = useState([]);

    useEffect(() => {
        const unsubscribe = electionCollection.onSnapshot((snapshot) => {
            setElections(snapshot.docs.map((doc) => ({ key: doc.id, value: doc.data().name })));
        });

        return unsubscribe;
    }, []);

    const {
        data: dataResult,
        isError,
        isLoading,
        isSuccess

    } = useContractRead({
        address: '0x23014E1D38391C52c7b3e458D3f170D19249CAE8',
        abi: abi,
        functionName: 'getElectionResults',
        args: [electionIdBigInt],
        chainId: sepolia.id,
    });

    const calculateResults = (dataResult) => {
        if (!dataResult || !dataResult[0] || !dataResult[1]) {
            return { winner: null, margin: null, hasMajority: null };
        }

        const candidateVotesBig = dataResult[1].map(BigInt);
        const candidateVotes = candidateVotesBig.map(Number);
        const maxVotes = Math.max(...candidateVotes);
        const winnerIndex = candidateVotes.indexOf(maxVotes);
        const winner = dataResult[0][winnerIndex];
        const totalVotes = BigInt(candidateVotes.reduce((sum: any, votes: any) => sum + votes, 0));
        const majorityThreshold = BigInt(totalVotes / 2n) + 1n; 
        const hasMajority = maxVotes >= majorityThreshold;

        if (Number(totalVotes) === 0) {
            return { winner: "No Winner", margin: "No Margin", hasMajority: false };
        }

        const margin = (Number(maxVotes) / Number(totalVotes)) * 100;
        const formattedMargin = margin.toFixed(0);

        return { winner, formattedMargin, maxVotes, totalVotes, hasMajority };
    };

    return (

        <View style={styles.result}>
            <View style={styles.resultHeader}>
                <Text style={styles.electionResult}>Election Results</Text>
            </View>
            <View style={styles.resultItem}>
                <Text style={styles.resultDropdown}>Please select the election name:</Text>
                <SelectList
                    setSelected={(val) => setChosenElectionId(val)}
                    data={elections}
                    save="key"
                />
                <ScrollView style={{ height: "100%" }}>
                    {<View>
                        {isLoading && (
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

                        {isSuccess && dataResult && (
                            <View>

                                <View
                                    style={{
                                        borderBottomColor: 'black',
                                        borderBottomWidth: StyleSheet.hairlineWidth,
                                        marginTop: 30,
                                    }}
                                />
                                {dataResult[0].map((candidateName, index) => (
                                    <View key={index}>
                                        <Text style={styles.resultText}>
                                            {candidateName}: {BigInt(dataResult[1][index]).toString()} votes
                                        </Text>
                                    </View>
                                ))}
                                {calculateResults(dataResult) && (

                                    <View style={{ marginTop: 30 }}>
                                        <View
                                            style={{
                                                borderBottomColor: 'black',
                                                borderBottomWidth: StyleSheet.hairlineWidth,
                                            }}
                                        />
                                        <Text style={styles.resultText}>Winner: {calculateResults(dataResult).winner}</Text>
                                        <Text style={styles.resultText}>Margin of Victory: {calculateResults(dataResult).formattedMargin}%</Text>
                                        <Text style={styles.resultText}>Majority Votes: {calculateResults(dataResult).maxVotes}</Text>
                                        <Text style={styles.resultText}>
                                            Majority Achieved: {calculateResults(dataResult).hasMajority ? "Yes" : "No"}
                                        </Text>
                                        <Text style={styles.resultText}>Total voters: {Number(calculateResults(dataResult).totalVotes)}</Text>
                                    </View>
                                )}

                            </View>
                        )}
                        {isError && <Text style={styles.resultText}>The election is not started or ended yet!</Text>}
                    </View>}

                </ScrollView>
            </View>
            <Pressable style={styles.backButton} onPress={() => navigation.navigate("Dashboard")}>
                <Text style={styles.backText}>Back</Text>
            </Pressable>
        </View>
    );
};


const styles = StyleSheet.create({
    result: {
        backgroundColor: Color.lightcyan,
        borderStyle: "solid",
        borderColor: Color.black,
        borderWidth: 1,
        flex: 1,
        width: "100%",
        height: "100%",
        overflow: "hidden",
    },
    aktaBerkanun: {
        alignSelf: "center",
        fontSize: FontSize.size_xl,
        fontWeight: "800",
        fontFamily: FontFamily.interExtrabold,
        color: Color.darkslategray,
    },
    electionResult: {
        alignSelf: "center",
        fontSize: FontSize.size_6xl,
        fontWeight: "800",
        fontFamily: FontFamily.interExtrabold,
        color: Color.white,
        position: "absolute",
        marginTop: 25,
    },
    resultItem: {
        top: "15%",
        backgroundColor: Color.white,
        width: "85%",
        height: "65%",
        position: "absolute",
        alignSelf: "center",
        overflow: "hidden",
        padding: 10,
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
    backText: {
        color: Color.white,
        fontSize: FontSize.size_s,
        fontFamily: FontFamily.interExtrabold,
        fontWeight: "bold",
        textAlign: "center",
    },
    resultHeader: {
        top: "0%",
        backgroundColor: Color.darkcyan,
        width: "100%",
        height: "8%",
        position: "absolute",
        alignSelf: "center",
        overflow: "hidden",
    },
    resultDropdown: {
        alignSelf: "center",
        fontSize: FontSize.size_xl,
        fontWeight: "800",
        fontFamily: FontFamily.interExtrabold,
        color: Color.darkslategray,
        marginBottom: 20
    },
    resultText: {
        fontSize: FontSize.size_xl,
        fontFamily: FontFamily.interRegular,
        color: Color.darkslategray,
        textAlign: "left",
        padding: 10,
    },

});

export default Result;
function intValue(arg0: any) {
    throw new Error("Function not implemented.");
}

