const Stack = createNativeStackNavigator();
import 'react-native-get-random-values'
import "text-encoding-polyfill";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import LoginPage from "./screens/LoginPage";
import VotingPage from "./screens/VotingPage";
import Result from "./screens/Result";
import Authentication from "./screens/Authentication";
import Dashboard from "./screens/Dashboard";
import VotingConfirmed from "./screens/VotingConfirmed";
import Confirmation from "./screens/Transaction";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ConnectWallet from "./screens/ConnectWallet";
import ProfilePage from "./screens/ProfilePage";
import Rule from "./screens/Rule";
import { LogBox, AppRegistry } from "react-native";
import '@walletconnect/react-native-compat';
import { WagmiConfig } from 'wagmi'
import { mainnet, sepolia } from 'viem/chains'
import { createWeb3Modal, defaultWagmiConfig, Web3Modal } from '@web3modal/wagmi-react-native'
import { projectId, metadata } from './config';
import Eligibility from './screens/Eligibility';

const chains = [sepolia]

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

createWeb3Modal({
  projectId,
  chains,
  wagmiConfig
})

const App = () => {

  const [hideSplashScreen, setHideSplashScreen] = React.useState(true);
  const [fontsLoaded, error] = useFonts({
    Inter_regular: require("./assets/fonts/Inter_regular.ttf"),
    Inter_bold: require("./assets/fonts/Inter_bold.ttf"),
    Inter_extrabold: require("./assets/fonts/Inter_extrabold.ttf"),
  });


  LogBox.ignoreAllLogs();

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <NavigationContainer>
          {hideSplashScreen ? (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen
                name="LoginPage"
                component={LoginPage}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="VotingPage"
                component={VotingPage}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Result"
                component={Result}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Authentication"
                component={Authentication}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Dashboard"
                component={Dashboard}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="VotingConfirmed"
                component={VotingConfirmed}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Confirmation"
                component={Confirmation}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ConnectWallet"
                component={ConnectWallet}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ProfilePage"
                component={ProfilePage}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Rule"
                component={Rule}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Eligibility"
                component={Eligibility}
                options={{ headerShown: false }}
              />


            </Stack.Navigator>
          ) : null}
        </NavigationContainer>
        <Web3Modal />
      </WagmiConfig>
    </>
  );
};
export default App;
