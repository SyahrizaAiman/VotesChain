import * as React from "react";
import { useState } from "react";
import { Image } from "expo-image";
import { StyleSheet, Text, View, Pressable, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontFamily, Color, FontSize, Border } from "../GlobalStyles";
import { authentication } from "../firebase";
import { signOut } from "firebase/auth";
import { useAccount,  useDisconnect  } from 'wagmi'

const Dashboard = () => {
  const navigation = useNavigation();
  const [isSignedIn, setIsSignedIn] = useState(true);
  const { address ,isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  const handleSignOut = async () => {
    try {
      Alert.alert(
        'Logout Confirmation',
        'Are you sure you want to log out?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Log Out',
            onPress: async () => {
              await signOut(authentication);
              setIsSignedIn(false);
              disconnect();
              console.log("Signed out successfully");
              navigation.navigate("LoginPage");
            },
          },
        ]
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.dashboard}>
      <View style={styles.dashboardHeader}>
        <Text style={[styles.dashboardText]}>Dashboard</Text>
      </View>
      <View>
        <Pressable
          style={[styles.personalInfoParent, styles.frameParentLayout]}
          onPress={() => navigation.navigate("ProfilePage")}
        >
          <Text style={[styles.personalInfo, styles.votingTypo]}>
            Personal Info
          </Text>
          <Image
            style={styles.vectorIcon}
            contentFit="cover"
            source={require("../assets/vector.png")}
          />
        </Pressable>
        <Pressable
          style={[styles.votingParent, styles.frameParentLayout]}
          onPress={() => navigation.navigate("Rule")}
        >
          <Text style={[styles.voting, styles.votingTypo]}>
            Voting
          </Text>
          <Image
            style={styles.vectorIcon}
            contentFit="cover"
            source={require("../assets/vector1.png")}
          />
        </Pressable>
        <Pressable
          style={[styles.resultParent, styles.frameParentLayout]}
          onPress={() => navigation.navigate("Result")}
        >
          <Text style={[styles.result, styles.votingTypo]}>
            Result
          </Text>
          <Image
            style={styles.vectorIcon}
            contentFit="cover"
            source={require("../assets/carbonresult.png")}
          />
        </Pressable>
            </View>
            <View style={{ flex: 1, justifyContent: "flex-end" }}>
              {isConnected && (
                <Pressable style={styles.disconnectButton} onPress={handleSignOut}>
                  <Text style={styles.disconnectText}>Log Out</Text>
                </Pressable>
              )}
            </View>
    
    </View>
  );
};

const styles = StyleSheet.create({
  frameParentLayout: {
    height: 100,
    width: "80%",
    position: "absolute",
    alignSelf: "center",
  },
  votingTypo: {
    color: Color.darkslategray,
    fontSize: FontSize.size_6xl,
    top: 35,
    textAlign: "left",
    fontFamily: FontFamily.interExtrabold,
    fontWeight: "800",
    position: "absolute",
  },
  dashboardHeader: {
    top: "0%",
    backgroundColor: Color.darkcyan,
    width: "100%",
    height: "8%",
    position: "absolute",
    alignSelf: "center",
    overflow: "hidden",
  },
  dashboardText: {
    alignSelf: "center",
    fontSize: FontSize.size_6xl,
    fontWeight: "800",
    fontFamily: FontFamily.interExtrabold,
    color: Color.white,
    position: "absolute",
    marginTop: 25,
  },
  personalInfo: {
    left: 150,
  },
  vectorIcon: {
    height: "40%",
    width: "10%",
    top: "35%",
    right: "75%",
    bottom: "35%",
    left: "15%",
    maxWidth: "100%",
    maxHeight: "100%",
    position: "absolute",
    overflow: "hidden",
  },
  personalInfoParent: {
    top: 150,
    shadowOpacity: 1,
    elevation: 4,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowColor: "rgba(0, 0, 0, 0.25)",
    width: "70%",
    borderRadius: Border.br_xl,
    backgroundColor: Color.white,
    alignSelf: "center",
  },
  votingParent: {
    top: 350,
    shadowOpacity: 1,
    elevation: 4,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowColor: "rgba(0, 0, 0, 0.25)",
    width: "70%",
    borderRadius: Border.br_xl,
    backgroundColor: Color.white,
    alignSelf: "center",
  },
  resultParent: {
    top: 550,
    shadowOpacity: 1,
    elevation: 4,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowColor: "rgba(0, 0, 0, 0.25)",
    width: "70%",
    borderRadius: Border.br_xl,
    backgroundColor: Color.white,
    alignSelf: "center",
  },
  frameChild: {
    backgroundColor: Color.white,
    borderRadius: Border.br_xl,
    width: 300,
    left: 0,
    top: 0,
  },
  voting: {
    left: 150,
  },
  rectangleParent: {
    top: 289,
    shadowOpacity: 1,
    elevation: 4,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowColor: "rgba(0, 0, 0, 0.25)",
    left: 46,
    width: 300,
    borderRadius: Border.br_xl,
  },
  result: {
    left: 150,
  },
  carbonresultIcon: {
    left: 45,
    width: 30,
    height: 30,
    top: 35,
    position: "absolute",
    overflow: "hidden",
  },
  rectangleGroup: {
    left: 0,
    top: 0,
  },
  frameWrapper: {
    top: 459,
    shadowOpacity: 1,
    elevation: 4,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowColor: "rgba(0, 0, 0, 0.25)",
    left: 46,
    width: 300,
    borderRadius: Border.br_xl,
  },
  icon: {
    borderRadius: Border.br_11xl,
    height: "100%",
    width: "100%",
  },
  wrapper: {
    left: 0,
    top: 0,
  },

  vectorContainer: {
    top: 629,
    left: 47,
  },
  groupParent: {
    height: 668,
    width: 393,
  },
  disconnectButton: {
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
  disconnectText: {
    color: Color.white,
    fontFamily: FontFamily.interExtrabold,
    fontSize: FontSize.size_s,
    textAlign: "center",
  },
  shadowProp: {
    elevation: 20,
    shadowColor: '#52006A',
  },
  dashboard: {
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
  
});

export default Dashboard;
