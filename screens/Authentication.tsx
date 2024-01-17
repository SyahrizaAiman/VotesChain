import * as React from "react";
import { StyleSheet, TextInput, View, Pressable, TouchableOpacity, Text, Button, Alert } from "react-native";
import { FontSize, FontFamily, Color } from "../GlobalStyles";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { getApp } from 'firebase/app';
import { getAuth, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
import { Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';

const dimensions = Dimensions.get('window');
const Width = dimensions.width;
const Height = dimensions.height;

const Authentication = () => {
    const navigation = useNavigation();
    const [errorMessage, setErrorMessage] = useState("");
    const app = getApp();
    const auth = getAuth(app);
    const recaptchaVerifier = React.useRef(null);
    const [verificationId, setVerificationID] = useState('');
    const [verificationCode, setVerificationCode] = useState("");
    const firebaseConfig = app ? app.options : undefined;
    const [info, setInfo] = useState("");
    const [phoneNumber, setPhoneNumber] = useState('+60');
    const attemptInvisibleVerification = false;


    const handleSendVerificationCode = async () => {
        try {
            const phoneProvider = new PhoneAuthProvider(auth); // initialize the phone provider.
            const verificationId = await phoneProvider.verifyPhoneNumber(
                phoneNumber,
                recaptchaVerifier.current
            ); // get the verification id
            setVerificationID(verificationId); // set the verification id
            setInfo('Verification code has been sent to your phone'); // If Ok, show message.
        } catch (error) {
            Alert.alert("Invalid phone number", "Please re-enter your phone number and try again.")
        }
    };

    const handleVerifyVerificationCode = async () => {
        try {
            const credential = PhoneAuthProvider.credential(verificationId, verificationCode); // get the credential
            await signInWithCredential(auth, credential); // verify the credential
            setInfo('Phone authentication successful'); // if OK, set the message
            navigation.navigate("ConnectWallet"); // navigate to the welcome screen
        } catch (error) {
            Alert.alert("Invalid code", "Please re-enter the code and try again.")
        }
    }

    return (
        <View style={styles.AuthenticationPage}>
            <View style={styles.authHeader}>
                <Text style={styles.authentication}>Authentication</Text>
            </View>
            <View>
                <LottieView source={require('../assets/Auth.json')} 
                style={{aspectRatio: 1, width: Width * 0.5, alignSelf: "center", marginBottom: 120}}
                autoPlay
                 />
            </View>
            <FirebaseRecaptchaVerifierModal
                ref={recaptchaVerifier}
                firebaseConfig={firebaseConfig}
            />
            {
                info && <Text style={styles.text}>{info}</Text>
            }
            { // show the phone number input field when verification id is not set.
                !verificationId && (
                    <View>
                        <Text style={styles.text}>Enter the phone number</Text>
                        <TextInput
                            style={styles.inputNum}
                            placeholder='Insert Phone Number Here'
                            autoFocus
                            autoCompleteType='tel'
                            keyboardType='phone-pad'
                            textContentType='telephoneNumber'
                            value={phoneNumber}
                            onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
                        />

                        <Button
                            onPress={() => handleSendVerificationCode()}
                            title="Send Verification Code"
                            disabled={!phoneNumber}
                        />
                    </View>
                )

            }

            { // if verification id exists show the confirm code input field.
                verificationId && (
                    <View>
                        <View>
                            <Text style={styles.text}>Enter the verification code</Text>

                            <TextInput
                                style={styles.input}
                                editable={!!verificationId}
                                placeholder="Insert verification code"
                                keyboardType='numeric'
                                onChangeText={setVerificationCode}
                            />

                            <Button
                                title="Confirm Verification Code"
                                disabled={!verificationCode}
                                onPress={() => handleVerifyVerificationCode()}
                            />
                        </View>
                    </View>
                )
            }

            {attemptInvisibleVerification && <FirebaseRecaptchaBanner />}
        </View>
    );
};

const styles = StyleSheet.create({
    text: {
        marginTop: 20,
        color: Color.darkcyan,
        fontSize: 20,
        fontFamily: FontFamily.interExtrabold,
        fontWeight: "bold",
        textAlign: "center",
    },
    AuthenticationPage: {
        flex: 1,
        backgroundColor: '#D1E9EC',
        alignItems: 'center',
        justifyContent: 'center',
    },
    authHeader: {
        top: "0%",
        backgroundColor: Color.darkcyan,
        width: "100%",
        height: "8%",
        position: "absolute",
        alignSelf: "center",
        overflow: "hidden",
    },
    authentication: {
        alignSelf: "center",
        fontSize: FontSize.size_6xl,
        fontWeight: "800",
        fontFamily: FontFamily.interExtrabold,
        color: Color.white,
        position: "absolute",
        marginTop: 25,
    },
    input: {
        height: 50,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        padding: 10,
        marginTop: 10,
        marginBottom: 30,
        textAlign: "center",
        fontSize: 20,
        color: Color.darkcyan,
    },
    inputNum: {
        height: 50,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        padding: 10,
        marginTop: 10,
        marginBottom: 30,
        textAlign: "left",
        fontSize: 20,
        color: Color.darkcyan,
    },
    select: {
        width: 150,
        height: 40,
        backgroundColor: 'white',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        textAlign: 'center',
    },
});

export default Authentication;
function generateOTP() {
    throw new Error("Function not implemented.");
}
