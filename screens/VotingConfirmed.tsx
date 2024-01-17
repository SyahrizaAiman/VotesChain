import * as React from "react";
import { Image } from "expo-image";
import {
  StyleSheet,
  Text,
  Pressable,
  TouchableOpacity,
  View,
  Linking,
  Dimensions
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FontSize, FontFamily, Color, Border } from "../GlobalStyles";

const dimensions = Dimensions.get('window');
const Width = dimensions.width;
const Height = dimensions.height;


const VotingConfirmed = () => {
  const navigation = useNavigation();
  const route = useRoute()
  const hexValue = (route.params as { hexValue?: string })?.hexValue;

  return (
    <View style={styles.votingConfirmed}>
      <View style={styles.confirmHeader}>
        <Text style={styles.confirmHeaderText}>Voting Confirmed</Text>
      </View>
      <Image
        style={styles.image2Icon}
        contentFit="cover"
        source={require("../assets/image-2.png")}
      />
      <Text style={[styles.yourVoteHas]}>
        Your vote has been confirmed!
      </Text>
      <Pressable style={styles.receiptButton}
        onPress={() => Linking.openURL(`https://sepolia.etherscan.io/tx/${hexValue}`)}>
        <Text style={styles.Text}>Transaction Receipt</Text>
      </Pressable>
      <TouchableOpacity
        style={[styles.vectorParent]}
        activeOpacity={0.2}
        onPress={() => navigation.navigate("Dashboard")}
      >
        <Text style={[styles.exitTypo]}>Exit</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  exitTypo: {
    fontFamily: FontFamily.interBold,
    textAlign: "center",
    fontSize: FontSize.size_xl,
    color: Color.white,
  },
  image2Icon: {
    height: Height * 0.35,
    width: Width * 0.7,
    top: "-10%",
  },
  yourVoteHas: {
    fontWeight: "700",
    fontFamily: FontFamily.interBold,
    color: Color.darkslategray,
    marginTop: 20,
    fontSize: FontSize.size_6xl,
  },
  receiptButton: {
    backgroundColor: Color.darkcyan,
    borderRadius: Border.br_xl,
    alignSelf: "center",
    width: 200,
    height: 25,
    marginTop: 20,
  },
  vectorParent: {
    backgroundColor: Color.red,
    borderRadius: Border.br_xl,
    paddingHorizontal: 5,
    paddingVertical: 5,
    alignSelf: "center",
    position: "absolute",
    bottom: "10%",
    width: 300,
    height: 42,
  },
  confirmHeader: {
    top: "0%",
    backgroundColor: Color.darkcyan,
    width: "100%",
    height: "8%",
    position: "absolute",
    alignSelf: "center",
    overflow: "hidden",
  },
  votingConfirmed: {
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
  confirmHeaderText: {
    alignSelf: "center",
    fontSize: FontSize.size_6xl,
    fontWeight: "800",
    fontFamily: FontFamily.interExtrabold,
    color: Color.white,
    position: "absolute",
    marginTop: 25,
  },
  Text: {
    alignSelf: "center",
    fontSize: FontSize.size_s,

    color: Color.white,
  },
});

export default VotingConfirmed;