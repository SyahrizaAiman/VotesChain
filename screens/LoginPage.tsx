import * as React from "react";
import { Image } from "expo-image";
import { StyleSheet, Pressable, TouchableOpacity, Text, View, TextInput, Dimensions, Linking, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Color, FontSize, FontFamily, Border } from "../GlobalStyles";
import { useState, useRef, useEffect } from "react";
import { authentication } from "../firebase";
import { signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";


const dimensions = Dimensions.get('window');
const Width = dimensions.width;
const Height = dimensions.height;

const LoginPage = () => {
  const navigation = useNavigation();
  const [setSignedIn, setIsSignedIn] = useState(false);
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const textInputRef = useRef('');

  const handleLogin = () => {
    signInWithEmailAndPassword(authentication, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (!user.emailVerified) {
          sendEmailVerification(user)
            .then(() => {
              console.log("Verification email sent");
              Alert.alert("Verification email sent", "Please verify your email before logging in.")
            })
            .catch((error) => {
              console.log("Error sending verification email:", error);
            });
          } else {
              navigation.navigate("Authentication", { user });
              console.log("Login Successful");
        }
        setEmail('');
        setPassword('');
        textInputRef.current.clear();
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
          alert('Wrong password. Please try again.');
        } else if (errorCode === 'auth/invalid-email') {
          alert('Invalid email address. Please try again.');
        } else {
          console.log(errorCode, errorMessage);
        }
      });
  };

  return (
    <View style={styles.loginPage}>
      <Image
        style={styles.logo}
        contentFit="cover"
        source={require("../assets/Logo.png")}
      />
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder='Voter ID'
          placeholderTextColor="#aaaaaa"
          onChangeText={text => setEmail(text)}
          value={email}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder='Voter Key'
          placeholderTextColor="#aaaaaa"
          onChangeText={text => setPassword(text)}
          value={password}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          secureTextEntry
        />
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <View
          style={{
            borderBottomColor: Color.darkslategray,
            borderBottomWidth: StyleSheet.hairlineWidth,
            marginTop: 30,
          }}
        />
        <Pressable
          style={[styles.contactAdminText]}
          onPress={() => {
            Linking.openURL('mailto:ahmadasyraf42726@gmail.com, syahrizaman01@gmail.com');
          }}
        >
          <Text style={[styles.pressableText]}>Can't login? Contact Administrator</Text>
        </Pressable>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  formContainer: {

  },
  input: {
    height: 50,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'white',
    padding: 10,
    marginTop: 10,
    marginBottom: 30,
    textAlign: "left",
    fontSize: 18,
    color: Color.darkcyan,
  },
  loginButton: {
    height: 47,
    borderRadius: 20,
    backgroundColor: Color.darkcyan,
    width: Width * 0.8,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 16
  },
  listContainer: {
    marginTop: 20,
    padding: 20,
  },
  entityContainer: {
    marginTop: 16,
    borderBottomColor: '#cccccc',
    borderBottomWidth: 1,
    paddingBottom: 16
  },
  entityText: {
    fontSize: 20,
    color: '#333333'
  },
  loginPage: {
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 1,
    flex: 1,
    height: 787,
    overflow: "hidden",
    paddingHorizontal: 20,
    paddingVertical: 50,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    backgroundColor: Color.lightcyan,
  },
  logo: {
    height: Height * 0.35,
    width: Width * 0.7,
    top: "-10%",
  },
  contactAdminText: {
    color: 'blue',
    fontSize: 16,
    alignSelf: "center",
    marginTop: 10,
  },
 pressableText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default LoginPage;
