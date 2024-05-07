import React, { useState, useEffect, useLayoutEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';


import HomeScreen from './pages/Homepage-Student';
import HomeScreenTutor from './pages/Homepage-Tutor';
import Details from './pages/Details';
import Chat from './pages/Chat';
import Message from './pages/Message';
import MessageTmp from './pages/MessageTmp';
import ProfileScreen from './pages/Profile';
import Edit from './pages/Edit';

import HomeIcon from './assets/tab-icons/home.svg';
import ChatIcon from './assets/tab-icons/chat.svg';
import ProfileIcon from './assets/tab-icons/profile.svg';

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import {
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { auth, database } from "./config/firebase";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName="HomeList">
      <Stack.Screen 
        name="HomeList" 
        component={HomeScreen}
      />
      <Stack.Screen name="Details" component={Details} 
        options={({ route }) => ({ 
          title: route.params.name,
          headerTitleAlign: 'left',
        })}
      />
      <Stack.Screen name="Message" component={MessageTmp} 
        options={({ route }) => ({
          headerTitleAlign: 'center',
        })}
      />
    </Stack.Navigator>
  )
}

const ChatStack = () => {
  return (
    <Stack.Navigator initialRouteName="ChatList">
      <Stack.Screen name="ChatList" component={Chat} 
        initialParams={{ isStudent: true }}
        />
      <Stack.Screen name="Message" component={MessageTmp} 
        options={({ route }) => ({ 
          // title: route.params.name,
          headerTitleAlign: 'center',
        })}
        initialParams={{ isStudent: true }}
      />
    </Stack.Navigator>
  )
}

const ChatTutorStack = () => {
  return (
    <Stack.Navigator initialRouteName="ChatList">
      <Stack.Screen name="ChatList" component={Chat} 
        initialParams={{ isStudent: false }}
        />
      <Stack.Screen name="Message" component={MessageTmp} 
        options={({ route }) => ({ 
          // title: route.params.name,
          headerTitleAlign: 'center',
        })}
        initialParams={{ isStudent: false }}
      />
    </Stack.Navigator>
  )
}

const ProfileStack = () => {
  return (
    <Stack.Navigator initialRouteName='ProfileScreen'>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} 
        initialParams={{isStudent: true}} options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="Edit" component={Edit} initialParams={{isStudent: true}}/>
    </Stack.Navigator>
  )
}

const ProfileTutorStack = () => {
  return (
    <Stack.Navigator initialRouteName='ProfileScreen'>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} 
        initialParams={{isStudent: false}} options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="Edit" component={Edit} initialParams={{isStudent: false}}/>
    </Stack.Navigator>
  )
}

// Tab navigation for students
export const TabNavigator = () => {
  const [count, setCount] = useState(0);

  var height = null;
  var paddingBottom = null;
  if (Platform.OS === 'ios') {
    height = "11%";
    paddingBottom = "7%";
  } else {
    height = "8%";
    paddingBottom = "2%";
  }

  // Retrieve the number of unread messsages for this student
  useEffect(() => {
    const userEmail = auth.currentUser?.email;
  
    const counts = (chatsIds) => {
      
      let currentChats = [];
      let currentCount = 0;
      try {
        if (chatsIds.length > 0) {
            if (chatsIds.length > currentChats.length) {
                chatsIds.forEach(chatId => {
                    var chatRef = doc(database, "Chats", chatId);
                    onSnapshot(chatRef, snapshot => {
                        currentChats = currentChats.filter(chat => {
                            return chat._id !== chatId
                        });
                        const chat = {
                          _id: snapshot.id,
                          count: snapshot.get(userEmail),
                        }
                        currentChats.push(chat);
  
                        currentCount = 0;
                        currentChats.forEach(obj => {
                          if (obj.count)
                            currentCount += obj.count
                        });
                        setCount(currentCount);
                    }); 
                });
            }
        }
        return count;
      } catch (e) { console.log(e); }
    }

    const roleRef = doc(database, "Student", userEmail);
    // console.log("role", roleRef);
    getDoc(roleRef)
    .then(snapshot => {
      counts(snapshot.get("Chats"));
    })
  }, [])
  console.log("Unread messages:", count);
  return (
    <BottomSheetModalProvider>
      <Tab.Navigator 
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: '#E59333',
          tabBarInactiveTintColor: '#2E4851',
          tabBarStyle: {
            backgroundColor: '#f0f0f0',
            height: height, // Increase the height of the bottom tab bar
            paddingBottom: paddingBottom,
          },
          tabBarLabelStyle: {
            fontSize: 13,
            fontWeight: '500',
            marginBottom: "2%"
          },
          tabBarHideOnKeyboard: true,
        })}
        backBehavior='none'
      >
        
        <Tab.Screen 
          name="Home" 
          component={HomeStack} 
          options={({ route }) => ({
            tabBarIcon: ({ color }) => (
              <HomeIcon stroke={color} />
            ),
            tabBarStyle: ((route) => {
              const routeName = getFocusedRouteNameFromRoute(route) ?? ""
              // console.log(routeName)
              if (routeName === 'Message' || routeName === 'Details') {
                return { display: "none" }
              }
              return {
                backgroundColor: '#f0f0f0',
                height: height, // Increase the height of the bottom tab bar
                paddingBottom: paddingBottom,
              }
            })(route),
            headerShown: false
          })}
        />
        
        <Tab.Screen 
          name="Chat" 
          component={ChatStack}
          options={({ route }) => ({
            tabBarIcon: ({ color }) => (
              <ChatIcon fill={color} />
            ),
            tabBarStyle: ((route) => {
              const routeName = getFocusedRouteNameFromRoute(route) ?? ""
              // console.log(routeName)
              if (routeName === 'Message') {
                return { display: "none" }
              }
              return {
                backgroundColor: '#f0f0f0',
                height: height, // Increase the height of the bottom tab bar
                paddingBottom: paddingBottom,
              }
            })(route),
            headerShown: false,
            tabBarBadge: count === 0 ? null : count,
          })}
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileStack} 
          options={({ route }) => ({
            tabBarIcon: ({ color }) => (
              <ProfileIcon stroke={color} />
            ),
            tabBarStyle: ((route) => {
              const routeName = getFocusedRouteNameFromRoute(route) ?? ""
              // console.log(routeName)
              if (routeName === 'Edit') {
                return { display: "none" }
              }
              return {
                backgroundColor: '#f0f0f0',
                height: height, // Increase the height of the bottom tab bar
                paddingBottom: paddingBottom,
              }
            })(route),
            headerShown: false
          })}
        />
      </Tab.Navigator>
    </BottomSheetModalProvider>
  );
};

// Tab navigation for tutors
export const TabNavigatorTutor = () => {
  const [count, setCount] = useState(0);

  var height = null;
  var paddingBottom = null;
  if (Platform.OS === 'ios') {
    height = "11%";
    paddingBottom = "7%";
  } else {
    height = "8%";
    paddingBottom = "2%";
  }

  // Retrieve the number of unread messsages for this tutor
  useEffect(() => {
    const userEmail = auth.currentUser?.email;
  
    // console.log("Loading chat ids...")
  
    const counts = (chatsIds) => {
      
      let currentChats = [];
      let currentCount = 0;
      try {
        if (chatsIds.length > 0) {
            if (chatsIds.length > currentChats.length) {
                chatsIds.forEach(chatId => {
                    var chatRef = doc(database, "Chats", chatId);
                    onSnapshot(chatRef, snapshot => {
                        // console.log("Current:", currentChats);
                        currentChats = currentChats.filter(chat => {
                            // console.log("filter");
                            return chat._id !== chatId
                        });
                        const chat = {
                          _id: snapshot.id,
                          count: snapshot.get(userEmail),
                        }
                        currentChats.push(chat);
  
                        currentCount = 0;
                        currentChats.forEach(obj => {
                          // console.log(obj);
                          if (obj.count)
                            currentCount += obj.count
                        });
                        setCount(currentCount);
                        console.log("Current count:", currentCount);
                        // console.log("Current counts:", currentChats)
                    }); 
                });
            }
        }
        return count;
      } catch (e) { console.log(e); }
    }

    const roleRef = doc(database, "Tutor", userEmail);
    // console.log("role", roleRef);
    getDoc(roleRef)
    .then(snapshot => {
      counts(snapshot.get("Chats"));
    })
  }, [])
  console.log("Unread messages:", count);
  return (
    <BottomSheetModalProvider>
    <Tab.Navigator 
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#0AAAC0',
        tabBarInactiveTintColor: '#2E4851',
        tabBarStyle: {
          backgroundColor: '#f0f0f0',
          height: height, // Increase the height of the bottom tab bar
          paddingBottom: paddingBottom,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '500',
          marginBottom: "2%"
        },
        tabBarHideOnKeyboard: true,
      })}
      backBehavior='none'
    >
      
      <Tab.Screen 
        name="Home" 
        component={HomeScreenTutor} 
        options={() => ({
          tabBarIcon: ({ color }) => (
            <HomeIcon stroke={color} />
          ),
        })}
      />
      
      <Tab.Screen 
        name="Chat" 
        component={ChatTutorStack}
        options={({ route }) => ({
          tabBarIcon: ({ color }) => (
            <ChatIcon fill={color} />
          ),
          tabBarStyle: ((route) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? ""
            // console.log(routeName)
            if (routeName === 'Message') {
              return { display: "none" }
            }
            return {
              backgroundColor: '#f0f0f0',
              height: height, // Increase the height of the bottom tab bar
              paddingBottom: paddingBottom,
            }
          })(route),
          headerShown: false,
          tabBarBadge: count === 0 ? null : count,
        })}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileTutorStack} 
        options={({ route }) => ({
          tabBarIcon: ({ color }) => (
            <ProfileIcon stroke={color} />
          ),
          tabBarStyle: ((route) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? ""
            // console.log(routeName)
            if (routeName === 'Edit') {
              return { display: "none" }
            }
            return {
              backgroundColor: '#f0f0f0',
              height: height, // Increase the height of the bottom tab bar
              paddingBottom: paddingBottom,
            }
          })(route),
          headerShown: false
        })}
      />
    </Tab.Navigator>
    </BottomSheetModalProvider>
  );
};