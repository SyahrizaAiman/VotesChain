import { StyleSheet, Text, View, Pressable, Animated, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontFamily, Color, FontSize, Border } from "../GlobalStyles";
import React, { useState, useEffect } from 'react';
import { projectId, metadata } from '../config';
import { useAccount } from 'wagmi'
import { W3mButton } from "@web3modal/wagmi-react-native";
import { Image } from 'expo-image';
import LottieView from 'lottie-react-native';

const dimensions = Dimensions.get('window');
const Width = dimensions.width;
const Height = dimensions.height;

const ConnectWallet = () => {
  const navigation = useNavigation();
  const { address, isConnected } = useAccount()
  const [addressOpacity, setAddressOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(addressOpacity, {
      toValue: isConnected ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isConnected]);

  const navigateToDashboard = () => {
    navigation.navigate("Dashboard");
  };

  return (
    <View style={styles.container}>
      <View style={styles.walletHeader}>
        <Text style={styles.wallet}>Connect Wallet</Text>
      </View>
      <View>
        <LottieView source={require('../assets/blockchain.json')}
          style={{ aspectRatio: 1, width: Width * 1, alignSelf: "center", marginBottom: 100 }}
          autoPlay
        />
      </View>
      <View>
        <Text style={styles.heading}>
          Connect to Blockchain Wallet to proceed
        </Text>
        <Text style={styles.content}>Your address:</Text>
        <Animated.Text style={[styles.address, { opacity: addressOpacity }]}>
          {isConnected ? address : 'Not Connected'}
        </Animated.Text>
        <W3mButton />
        <Pressable
          onPress={navigateToDashboard}
          disabled={!isConnected} // Disable if not connected
          style={[styles.pressableMargin, {
            backgroundColor: isConnected ? Color.green : "#808080",
          }, !isConnected && styles.disabledButton]}
        >
          <Text style={styles.buttonText}>Proceed to Dashboard</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#325264',

  },
  content: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#325264',
  },
  address: {
    fontSize: 16,
    marginBottom: 16,
    color: '#325264',
  },
  pressableMargin: {
    marginTop: 16,
    padding: 10,
    borderRadius: Border.br_xl,
  },
  disabledButton: {
    marginTop: 16,
    padding: 10,
    borderRadius: Border.br_xl,
  },
  buttonText: {
    color: Color.white,
    fontSize: 16,
    textAlign: 'center',
  },
  walletHeader: {
    top: "0%",
    backgroundColor: Color.darkcyan,
    width: "100%",
    height: "8%",
    position: "absolute",
    alignSelf: "center",
    overflow: "hidden",
  },
  wallet: {
    alignSelf: "center",
    fontSize: FontSize.size_6xl,
    fontWeight: "800",
    fontFamily: FontFamily.interExtrabold,
    color: Color.white,
    position: "absolute",
    marginTop: 25,
  },
});

export default ConnectWallet;
