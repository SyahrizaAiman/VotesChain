import React, { useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { StyleSheet, Text, View, Pressable, ScrollView, ActivityIndicator, Alert, Image } from "react-native";
import { FontSize, FontFamily, Color, Border } from "../GlobalStyles";
import { useNavigation } from "@react-navigation/native";
import { useContractRead, sepolia, usePrepareContractWrite, useAccount } from 'wagmi'
import { abi } from '../abi'
import LottieView from "lottie-react-native";

const Eligibility = () => {
    const navigation = useNavigation();
    const [isEligible, setIsEligible] = useState(false);
    const [canVote, setCanVote] = useState(true);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const docRef = firestore().collection('Election').doc('electionDetail');
    const [fieldNameData, setFieldNameData] = useState<bigint>(0n);
    const [errorMessage, setErrorMessage] = useState("");
    const { address, isConnected } = useAccount()
    const [profileData, setProfileData] = useState('');

    useEffect(() => {
        docRef.get().then((doc) => {
            if (doc.exists) {
                setFieldNameData(doc.data()?.currentElection);
            } else {
                console.log("No such document!");
            }
        });
    }, []);

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
                });
        }
    }, [isConnected]);

    const { config } = usePrepareContractWrite({
        address: "0x23014E1D38391C52c7b3e458D3f170D19249CAE8",
        abi: abi,
        functionName: "vote",
        args: [fieldNameData, "candidate"],
        onError(error) {
            setCanVote(false)
            console.log('Error', error)
            const matchResult = error.message.match(/reverted with the following reason:\s+(.*)/);
            const revertedReason = matchResult ? matchResult[1].trim() : "";
            setErrorMessage(revertedReason);
            return error
        },
    });


    const {
        data: electionData,
        isError,
        isLoading,
        isSuccess

    } = useContractRead({
        address: '0x23014E1D38391C52c7b3e458D3f170D19249CAE8',
        abi: abi,
        functionName: 'getElection',
        args: [fieldNameData],
        chainId: sepolia.id,
    });

    const electionName = electionData?.[0];

    useEffect(() => {
        if (isSuccess) {
            const startTime = Number(electionData?.[1]);
            const endTime = Number(electionData?.[2]);
            setStartTime(new Date(startTime * 1000).toLocaleString()); // Convert to human-readable format
            setEndTime(new Date(endTime * 1000).toLocaleString());

            // Check eligibility based on current time
            const currentTimestamp = Math.floor(Date.now() / 1000);
            setIsEligible(currentTimestamp >= startTime && currentTimestamp <= endTime);
        } else if (isError) {
            // Handle errors appropriately, e.g., display an error message
        }
    }, [isSuccess, isError, electionData]);


    return (
        <View style={styles.eligible}>
            <View style={styles.eligibleHeader}>
                <Text style={styles.rulesAndRegulation}>Voters Eligibility</Text>
            </View>
            <View style={styles.eligibleItem}>
                <Image source={require("../assets/eligibility.png")}
                    style={{ marginBottom: 30, width: 200, height: 200, marginTop: 20, alignSelf: 'center' }} />
                <ScrollView style={{ height: "100%" }}>
                    {isLoading ? (
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
                    ) : (
                        <>
                            <Text style={styles.eligibleText}>Election Name: {electionName}</Text>
                            <Text style={styles.eligibleText}>Start Time: {startTime}</Text>
                            <Text style={styles.eligibleText}>End Time: {endTime}</Text>
                            <Text style={styles.statusText}>Status:</Text>
                            {
                                isEligible && canVote && profileData ? (
                                    <Text style={styles.Text} > Eligible to vote!</Text>
                                ) : (
                                    <Text style={styles.ineligibleText}>Not eligible to vote!</Text>
                                )}

                            <Text style={styles.statusText}>Reason:</Text>
                            {
                                canVote ? (
                                    <Text style={styles.Text} >Voter has not voted yet</Text>
                                ) : (
                                    <Text style={styles.ineligibleText}>{errorMessage}</Text>
                                )}
                            {
                                profileData ? (
                                    <Text style={styles.Text} ></Text>
                                ) : (
                                    <Text style={styles.ineligibleText}>Unauthorized voter!</Text>
                                )}
                        </>
                    )}
                </ScrollView>
            </View >
            <Pressable
                style={isEligible && canVote && profileData ? styles.agreeButton : styles.ineligibleButton}
                onPress={isEligible && canVote && profileData ? () => navigation.navigate("VotingPage") : () => navigation.navigate("Dashboard")}
            >
                <Text style={styles.agreeText}>{isEligible && canVote && profileData ? "Proceed to Voting Page" : "Return to Dashboard"}</Text>
            </Pressable>
        </View >
    );
};


const styles = StyleSheet.create({
    eligible: {
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
    rulesAndRegulation: {
        alignSelf: "center",
        fontSize: FontSize.size_6xl,
        fontWeight: "800",
        fontFamily: FontFamily.interExtrabold,
        color: Color.white,
        position: "absolute",
        marginTop: 25,
    },
    eligibleItem: {
        top: "15%",
        backgroundColor: Color.white,
        width: "85%",
        height: "65%",
        position: "absolute",
        alignSelf: "center",
        overflow: "hidden",
    },

    agreeButton: {
        backgroundColor: Color.green,
        borderRadius: Border.br_xl,
        paddingHorizontal: 5,
        paddingVertical: 10,
        alignSelf: "center",
        position: "absolute",
        bottom: "10%",
        width: 300,
        height: 42,
    },
    agreeText: {
        color: Color.white,
        fontSize: FontSize.size_s,
        fontFamily: FontFamily.interExtrabold,
        fontWeight: "bold",
        textAlign: "center",
    },
    eligibleText: {
        fontSize: FontSize.size_xl,
        fontFamily: FontFamily.interRegular,
        color: Color.darkslategray,
        textAlign: "left",
        padding: 10,
    },
    Text: {
        fontSize: FontSize.size_xl,
        fontFamily: FontFamily.interRegular,
        color: Color.green,
        textAlign: "left",
        padding: 10,
    },
    statusText: {
        fontSize: FontSize.size_xl,
        fontFamily: FontFamily.interRegular,
        color: Color.darkslategray,
        textAlign: "left",
        padding: 10,
        marginTop: 10,
    },
    ineligibleText: {
        fontSize: FontSize.size_xl,
        fontFamily: FontFamily.interRegular,
        color: "red",
        textAlign: "left",
        padding: 10,
    },
    eligibleHeader: {
        top: "0%",
        backgroundColor: Color.darkcyan,
        width: "100%",
        height: "8%",
        position: "absolute",
        alignSelf: "center",
        overflow: "hidden",
    },
    ineligibleButton: {
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

});

export default Eligibility;
