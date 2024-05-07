import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import BackButton from './pages/Signup/assets/back-arrow.svg';

import Welcome from './pages/Welcome.js';
import Signup from './pages/Signup/Signup.js';
import Login from './pages/Login.js'; 
import VerifyScreen from './pages/Signup/VerifyScreen.js';
import RoleScreen from './pages/Signup/RoleScreen.js';
import AboutYouScreen from './pages/Signup/AboutYouScreen.js';
import TabNavigator from './TabNavigator';
import Details from './pages/Signup/Details.js';

const Stack = createNativeStackNavigator();

const firstScreenBackButtonOption = ({ navigation }) => ({
        headerTransparent: true,
        headerTitle: '',
        headerShadowVisibile: false,
      });

const backButtonOption = ({ navigation }) => ({
        headerTransparent: true,
        headerTitle: '',
        headerShadowVisibile: false,
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <BackButton width={39} height={39} style={{ marginLeft: 5 }} />
          </TouchableOpacity>
        )
      });

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={Login} options={backButtonOption}/>
      <Stack.Screen name="Signup" component={Signup} options={backButtonOption}/>
      {/* <Stack.Screen name="Verify" component={VerifyScreen} options={backButtonOption} /> */}
      <Stack.Screen name="Role" component={RoleScreen} options={backButtonOption} />
      <Stack.Screen name="Details" component={Details} options={backButtonOption} />
      <Stack.Screen name="AboutYou" component={AboutYouScreen} options={backButtonOption} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
