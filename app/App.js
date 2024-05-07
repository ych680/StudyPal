import React, { useState, createContext, useContext, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { onAuthStateChanged } from "firebase/auth";
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NotifierWrapper } from 'react-native-notifier';
import 'expo-dev-client';
import { GoogleSignin } from "@react-native-google-signin/google-signin";

import StackNavigator from './StackNavigator';
import * as Font from 'expo-font';

// Firebase
import {
  getDoc,
  collection,
  doc,
} from "firebase/firestore";
import { auth, database } from "./config/firebase";

import { TabNavigator, TabNavigatorTutor } from './TabNavigator';

const AuthenticatedUserContext = createContext({});

const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
}

export default function App() {
  GoogleSignin.configure({
    webClientId: '1024367022529-vdlouild7ho5rnrcn9hk68hb8pigd0up.apps.googleusercontent.com',
  })

  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadResources = async () => {
      try {
        await Font.loadAsync({
          'Inter': require('./assets/fonts/Inter.ttf'),
          'Inter-SemiBold': require('./assets/fonts/Inter-SemiBold.ttf'),
          'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf')
          // add other font styles if needed
        });
        setFontsLoaded(true);
      } catch (error) {
        console.warn(error);
      }
    };

    loadResources();
  }, []);

  if (!fontsLoaded) {
    return null; 
  }

  function RootNavigator () {
    const { user, setUser } = useContext(AuthenticatedUserContext);
    const [loading, setLoading] = useState(true);
    const [isStudent, setIsStudent] = useState(null);
  
    useEffect(() => {
      const unsubscribeAuth = onAuthStateChanged(auth,
        async authenticatedUser => {
          authenticatedUser ? setUser(authenticatedUser) : setUser(null);
          if (authenticatedUser) {
            const userRef = doc(database, "Users", authenticatedUser.email);
            getDoc(userRef).then(snapshot => setIsStudent(snapshot.get("student")));
            if (isStudent) {
              const studentRef = doc(database, "Student", authenticatedUser.email);
              getDoc(studentRef).then(snapshot => {
                if (snapshot.exists()) {
                  // Navigate to student homepage
                }
              }).finally(() => setLoading(false));
            } else {
              const tutorRef = doc(database, "Tutor", authenticatedUser.email);
              getDoc(tutorRef).then(snapshot => {
                if (snapshot.exists()) {
                  // Navigate to tutor homepage
                }
              }).finally(() => setLoading(false));
            }
          } else {
            setIsStudent(null);
            setLoading(false);
          }
        }
      );
        return unsubscribeAuth;
    }, [user]);
    
    if(loading) {
      return (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
          <ActivityIndicator size="large" color="orange"/>
        </View>
      );
    }
  
    return (
      <NavigationContainer>
            { user 
                ? (
                    isStudent === true 
                        ? <TabNavigator />
                        : isStudent === false
                            ? <TabNavigatorTutor />
                            : (isStudent === undefined || isStudent === null)  // checks if 'student' field is missing or null
                                ? <StackNavigator initialRouteName="Role" />   // set the initial route to RoleScreen if missing data
                                : <StackNavigator />
                )
                : <StackNavigator />
            }
      </NavigationContainer>
    );    
  }

  return (
    <BottomSheetModalProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NotifierWrapper>
          <AuthenticatedUserProvider>
            <RootNavigator />
          </AuthenticatedUserProvider>
        </NotifierWrapper>
      </GestureHandlerRootView>
    </BottomSheetModalProvider>
  );
}
