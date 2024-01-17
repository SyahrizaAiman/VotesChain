import React, { useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { StyleSheet, Text, View, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { FontSize, FontFamily, Color, Border } from "../GlobalStyles";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";

const Rule = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [rules, setRules] = useState("");

    useEffect(() => {
        fetchRules().then((data) => setRules(data));
    }, []);

    const fetchRules = async () => {
        try {
            const db = firestore();
            const rulesRef = db.collection("Rules");
            const doc = await rulesRef.get();

            if (!doc.empty) {
                const rulesData = doc.docs[0].data();
                setLoading(false);
                return rulesData.rule;
            } else {
                console.error("No rules found in Firestore!");
                return "";
            }
        } catch (error) {
            console.error(error);
            return "";
        }

    };

    return (
        <View style={styles.rule}>
            <View style={styles.ruleHeader}>
                <Text style={styles.rulesAndRegulation}>Rules and Regulation</Text>
            </View>
            <View style={styles.ruleItem}>
                <Text style={styles.aktaBerkanun}>Election Act 1958</Text>
                <ScrollView style={{ height: "100%" }}>
                    {loading ? (
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
                        <Text style={styles.rulesText}>{rules}</Text>
                    )}
                </ScrollView>
            </View>
            <Pressable style={styles.agreeButton} onPress={() => navigation.navigate("Eligibility")}>
                <Text style={styles.agreeText}>Agree</Text>
            </Pressable>
        </View>
    );
};


const styles = StyleSheet.create({
    rule: {
        backgroundColor: Color.lightcyan,
        borderStyle: "solid",
        borderColor: Color.black,
        borderWidth: 1,
        flex: 1,
        width: "100%",
        height: "100%",
        overflow: "hidden",
    },
    ruleChild: {
        top: "10%",
        width: "100%",
        alignSelf: "center",
        height: "5%",
        position: "absolute",
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
    ruleItem: {
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
    rulesText: {
        fontSize: FontSize.size_s,
        fontFamily: FontFamily.interRegular,
        color: Color.darkslategray,
        textAlign: "left",
        padding: 10,
    },
    ruleHeader: {
        top: "0%",
        backgroundColor: Color.darkcyan,
        width: "100%",
        height: "8%",
        position: "absolute",
        alignSelf: "center",
        overflow: "hidden",
    },

});

export default Rule;
