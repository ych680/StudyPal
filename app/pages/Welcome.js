import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Button, ImageBackground, TouchableOpacity, Animated, } from 'react-native';
import React, {useRef} from 'react';

import Signup from "../assets/signup";
import Login from "../assets/login";

const iconImage = require('../assets/icon.png')
export default function App() {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const position = new Animated.ValueXY({x:5,y:115});
  
  Animated.spring(position, {
    delay:200,
    toValue:{x:-90, y :115},
    speed: 0.8,
    bounciness: 0.1,
    useNativeDriver: true,
  }).start()

  Animated.timing(fadeAnim, {
    delay:200,
    toValue: 0.8,
    duration: 1000,
    useNativeDriver: true,
  }).start()

  return (
    <View style={[styles.container, ]}>

      <SafeAreaView style={[styles.container, {bottom: 55}]}>
        <Animated.Image source={iconImage} style={{height: 115, width: 115, alignItems:"center", justifyContent:"center",
        transform:[{translateX:position.x},{translateY:position.y}]}} >

        </Animated.Image>
        <Animated.View
          style={[styles.fadingContainer,
            {
              opacity: fadeAnim,
            },
          ]}>
          <Text style={[styles.fadingText , {top : "30%", left : "10%"}]}>StudyPal</Text>
        </Animated.View>

        {/* <View style={styles.buttonContainer}> */}
        {/*   <TouchableOpacity onPress={() => navigation.navigate("Login")}> */}
        {/*     <Login style={styles.login}/> */}
        {/*   </TouchableOpacity> */}
        {/*   <TouchableOpacity onPress={() => navigation.navigate("Signup")}> */}
        {/*     <Signup style={styles.signup}/> */}
        {/*   </TouchableOpacity> */}
        {/* </View> */}

        <TouchableOpacity style={{backgroundColor:"black", top: "29%", width:"80%", height:"6%", alignItems:"center", justifyContent:"center", borderRadius: 20, shadowColor:"black",shadow0pacity:0.9,elevation:8}}
                          onPress={() => navigation.navigate("Login")}>
          <Text style={{color:"white", fontSize: 20, fontWeight:"bold"}}> Log In </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{backgroundColor:"white",top: "29.5%", marginTop: "3%",width:"80%", height:"6%", alignItems:"center", justifyContent:"center", borderRadius: 20, shadowColor:"black",shadow0pacity:0.9,elevation:8}}
                          onPress={() => navigation.navigate("Signup")}>
          <Text style={{color:"black", fontSize: 20, fontWeight:"bold"}}> Sign Up </Text>
        </TouchableOpacity>
      
      <StatusBar style="auto" />

    </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    width : '100%',
    height : '100%',
  },
  fadingContainer: {
    padding: 20,
  },
  fadingText: {
    fontSize: 38,
    fontFamily: 'Inter-Bold',
  },
  login: {
    top: Platform.OS === 'android' ? "410%" : "375%", 
    left: "auto", 
    width: "80%", 
    height: "6%", 
    alignItems: "center", 
    justifyContent: "center", 
    borderRadius: 20, 
    shadowColor: "black",
    shadowOpacity: 0.2,
    elevation: 8
  },
  signup: {
    top: Platform.OS === 'android' ? "500%" : "375%", 
    left: "auto", 
    alignItems: "center", 
    justifyContent: "center", 
    borderRadius: 20, 
    shadowColor: "black",
    shadowOpacity: 0.2,
    elevation: 8,
    marginLeft: '1.4%',
  },
});
