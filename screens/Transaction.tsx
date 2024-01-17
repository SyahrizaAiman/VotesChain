import * as React from "react";
import { Text, StyleSheet, Pressable, View, Linking } from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { Color, FontFamily, FontSize, Border } from "../GlobalStyles";
import { useContractRead, sepolia, useTransaction, useAccount } from 'wagmi'
import { abi } from '../abi'

const Transaction = () => {

  const { data, isError, isLoading } = useTransaction({
    hash: undefined,
  })

  return (
    <View style={styles.transaction}>
      <Text style={{ color: 'blue' }}
        onPress={() => Linking.openURL('http://google.com')}>
        Google
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  backTypo: {
    color: Color.white,
    fontFamily: FontFamily.interExtrabold,
    fontWeight: "800",
    top: 7,
    position: "absolute",
    textAlign: "left",
    fontSize: FontSize.size_xl,
  },
  areYouSure: {
    fontWeight: "700",
    fontFamily: FontFamily.interBold,
    color: Color.darkslategray,
    textAlign: "left",
    fontSize: FontSize.size_xl,
  },
  groupChild: {
    top: 0,
    left: 0,
    borderRadius: Border.br_11xl,
    position: "absolute",
    height: 39,
    width: 300,
  },
  confirm: {
    left: 110,
  },
  vectorParent: {
    marginTop: 102,
    height: 39,
    width: 300,
  },
  back: {
    left: 126,
  },
  transaction: {
    backgroundColor: Color.lightcyan,
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 1,
    flex: 1,
    width: "100%",
    overflow: "hidden",
    paddingHorizontal: 46,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Transaction;
