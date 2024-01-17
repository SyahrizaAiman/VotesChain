// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore }from "firebase/firestore";
import { initializeAuth, getReactNativePersistence, 
  multiFactor,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC6vxtwUch4zlbSpsk5FHyDb-wMR9XIFvA",
  authDomain: "algorithm-350715.firebaseapp.com",
  projectId: "algorithm-350715",
  storageBucket: "algorithm-350715.appspot.com",
  messagingSenderId: "911482483186",
  appId: "1:911482483186:web:21c42ec7b5746d47dbbb6b",
  measurementId: "G-JZWP2QNZD9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const authentication = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const db = getFirestore(app);


