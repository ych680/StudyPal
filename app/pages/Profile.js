import React, { useEffect, useRef } from 'react';
import { StyleSheet, SafeAreaView, View, Image, TouchableOpacity, Text, StatusBar, Modal, GestureRecognizer, Dimensions, Alert, ActivityIndicator, TextInput} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import{GestureHandlerRootView} from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetFooter, BottomSheetBackdrop, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import ExpandRight from '../assets/icons/Expand_right.svg';
import SignOut from '../assets/icons/Signout.svg';
import Online from '../assets/online.svg';
import Dnd from '../assets/dnd.svg';
import Invisible from '../assets/invisible.svg';

import {
  getDocs,
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc, 
  updateDoc,
} from "firebase/firestore";
import { signOut, getAuth, updatePassword,createUserWithEmailAndPassword, reauthenticateWithCredential, EmailAuthProvider, GoogleAuthProvider, validatePassword } from "firebase/auth";
import { auth, database, firebase} from "../config/firebase";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useState } from 'react';

// REM stylesheet
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});

const onSignOut = (navigation) => {
  Alert.alert("Sign Out", "Are you sure you want to sign out?", [
    {
      text: "Cancel",
      onPress: () => {
        console.log("Cancel Pressed")
      },
      style: "cancel"
    },
    {
      text: "Yes",
      onPress: () => {
        console.log("Sign Out");
        signOut(auth).then(() => {
          GoogleSignin.signOut().catch(error => console.log("Error signing out from Google Sign-In: ", error));
        }).catch(error => console.log("Error signing out from Firebase: ", error));
      }
    }
  ]);
}

// class StudentProfile extends React.Component {
export const StudentProfile = ({navigation, route}) => {
    const { isStudent } = route.params;
    // console.log(route.params)
    const userEmail = auth?.currentUser?.email;

    const snapPoints1 = ["35%","50%"];
    const snapPoints2 = ["50%", "80%"]
    const bottomSheetModalRef1 = useRef(null);
    const bottomSheetModalRef2 = useRef(null);

    function handlePresentModal1(){
        bottomSheetModalRef1.current?.present();
    }

    function handlePresentModal2(){
        bottomSheetModalRef2.current?.present();
    }

    const [name, setName] = useState("");
    
    const [npassword, setnPassword] = useState("");
    const [opassword, setoPassword] = useState("");

    const [passwordError, setPasswordError] = useState('');

    const isValidPassword = (password) => {
      // check minimum length
      if (password.length < 8) {
        console.log("Password should be at least 8 characters long.")
        setPasswordError("Password should be at least 8 characters long.");
        return false;
      }
  
      // check for at least one capital letter
      if (!/[A-Z]/.test(password)) {
        console.log("Password should contain at least one capital letter.");
        setPasswordError("Password should contain at least one capital letter.");
        return false;
      }
  
      // check for at least one number
      if (!/[0-9]/.test(password)) {
        console.log("password should contain at least one number.");
        setPasswordError("Password should contain at least one number.");
        return false;
      }
  
      // check for at least one special character
      const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
      if (!specialCharacters.test(password)) {
        console.log("Password should contain at least one special character.");
        setPasswordError("Password should contain at least one special character.");
        return false;
      }
      setPasswordError('');
      return true;
    };

    // Get the users ID token
    
    async function showUpdate() {
      // const { idToken} = await GoogleSignin.signIn();
      // const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      // const user_sign_in = auth().signInWithCredential(googleCredential);
      // console.log(typeof(user_sign_in));
      // return user_sign_in;
      const unsubsribe = auth.onAuthStateChanged((user) => {
        if (user) {
          user.providerData.forEach((provider) => {
            if (provider.providerId == 'google.com') {
              return false;
            }
            else {
              return true;
            }
          })
        }
      })
    
    }
    const [status, setStatus] = useState("Online");
    const online = require('../assets/icons/online.png');
    const dnd = require('../assets/icons/dnd.png');
    const invisible = require('../assets/icons/invisible.png');
    
    // const statuses = {online, dnd, invisible};
    // const [curr, setCurr] = useState(statuses.online);

    const Curr = () => {
      if (status == "Online")
        return <Online/>
      if (status == "Do Not Disturb")
        return <Dnd />
      else 
        return <Invisible />
    }


    const Status = async (s) => {
      if (isStudent) {
        // studentStatus();
        await updateDoc(doc(database, "Student", userEmail), {
          Status: s,
        })
      }
      else {
      //  tutorStatus();
       await updateDoc(doc(database, "Tutor", userEmail), {
         Status: s,
       })
      }
    }

    
    // const studentStatus = async () => {
    // }

    // const tutorStatus = async () => {
    // }


    const update =() => {
      const user = auth.currentUser;
      let cred = EmailAuthProvider.credential(userEmail, opassword);
      if (isValidPassword(npassword)) {
          reauthenticateWithCredential(auth.currentUser, cred).then(() => {
            updatePassword(auth.currentUser, npassword)
            .then(() => {
              console.log("Updated Successfully");
              Alert.alert("Updated Successfully");
            })
            .catch((error) => {
              console.log(error);
              handlePresentModal2();
              Alert.alert("Updated Failed")});

          })
        }
    }

    const [profilePic, setProfilePic] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
      console.log("Loading profile data...");
      if (isStudent) {
        const userRef = doc(database, "Student", userEmail);
        onSnapshot(userRef, snapshot => {
          // console.log(snapshot.data());
          let fullName = snapshot.get("Fname") + " " + snapshot.get("Lname");
          setName(fullName.length > 15 ? fullName.substring(0, 15) + "..." : fullName);
          setProfilePic(snapshot.get("ProfilePic"));
          setIsLoading(false);
        })
      } else {
        const userRef = doc(database, "Tutor", userEmail);
        onSnapshot(userRef, snapshot => {
          // console.log(snapshot.data());
          let fullName = snapshot.get("Fname") + " " + snapshot.get("Lname");
          setName(fullName.length > 15 ? fullName.substring(0, 15) + "..." : fullName);
          setProfilePic(snapshot.get("ProfilePic"));
          setIsLoading(false);
        })
      }
      
    }, []);

    if (isLoading) {
      return (
          <View style={{height: "100%", width: "100%", backgroundColor: "#FAFAFA", justifyContent: "center"}}>
              <ActivityIndicator size="large" color="orange" />
          </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
        <View style={styles.titleContainer}>
            <Text style={styles.titleText}>My Profile</Text>
        </View>

        <TouchableOpacity 
          style={styles.profileContainer}
          onPress={() => navigation.navigate("Edit")}
        >
            <Image 
              style={styles.img} 
              source={{ uri: profilePic }} 
            />
            <Text style={styles.name}>{name}</Text>
            <View style={styles.editContainer}>
                <Text style = {styles.edit}>Edit</Text>
                <ExpandRight width={50} height={50} />
            </View>
        </TouchableOpacity>


        <View style={styles.box1}>

        <TouchableOpacity onPress={handlePresentModal1} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <Text style={{fontSize: 18, marginLeft: '4%', marginTop: '1%', marginBottom: '1%'}}>Set Status</Text>
            <View style={{flexDirection: 'row', alignItems: 'center', marginRight:'-35%'}}>
              <Curr/>
              <Text style={{fontSize: 18, marginLeft: '5%', marginRight: '5%'}}> {status} </Text>
            </View>
            <ExpandRight width={40} height={40} />
          </TouchableOpacity>
          
            <BottomSheetModal
                    ref={bottomSheetModalRef1}
                    index={0}
                    snapPoints={snapPoints1}
                    backgroundStyle={styles.background}
                >
               
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <Text style={{fontSize: 28, fontWeight: 'bold'}}>Set Status</Text>

                  <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', backgroundColor:'#E5E9EC', width: '80%', borderRadius: 6, marginTop: '4%'}} onPress={() => {Status("Online"); setStatus("Online"); bottomSheetModalRef1.current.close()}}>
                    {/* <Image source={require('../assets/icons/online.png')} style={{marginLeft: '5%'}}/> */}
                    <Online style={{marginLeft: '5%'}}/>
                    <Text style={{fontSize: 18, marginTop: '4%', marginBottom: '4%', marginLeft: '5%'}}>Online</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', backgroundColor:'#E5E9EC', width: '80%', borderRadius: 6, marginTop: '2%'}} onPress={() => {Status("Do Not Disturb"); setStatus("Do Not Disturb"); bottomSheetModalRef1.current.close()}}>
                    {/* <Image source={require('../assets/icons/dnd.png')} style={{marginLeft: '5%', width: '5%'}}/> */}
                    <Dnd style={{marginLeft: '5%'}}/>
                    <Text style={{fontSize: 18, marginTop: '4%', marginBottom: '4%', marginLeft: '5%'}}>Do Not Disturb</Text>
                  </TouchableOpacity> 

                  <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', backgroundColor:'#E5E9EC', width: '80%', borderRadius: 6, marginTop: '2%'}} onPress={() => {Status("Invisible"); setStatus("Invisible"); bottomSheetModalRef1.current.close()}}>
                    {/* <Image source={require('../assets/icons/invisible.png')} style={{marginLeft: '5%'}}/> */}
                    <Invisible style={{marginLeft: '5%'}}/>
                    <Text style={{fontSize: 18, marginTop: '4%', marginBottom: '4%', marginLeft: '5%'}}>Invisible</Text>
                  </TouchableOpacity>   

              </View>
            </BottomSheetModal>

          {/* <View style={{height: 1, backgroundColor: '#E9E9E9'}} /> */}

          {/* <TouchableOpacity style={styles.btn}>
            <Text style={styles.text}>Biography & Intro</Text>
            <ExpandRight width={40} height={40} />
          </TouchableOpacity> */}
          
        </View>
        
        <View style={styles.box1}>
          {auth.currentUser.providerData.some(provider => provider.providerId !== 'google.com') ?
          
          <View>
          <TouchableOpacity onPress = {() => {handlePresentModal2(); setPasswordError('');} } style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <Text style={{fontSize: 18, marginTop: '2%', marginLeft: '4%'}}>Change Password</Text>
            <ExpandRight width={40} height={40} />
          </TouchableOpacity>

          <BottomSheetModal
                    ref={bottomSheetModalRef2}
                    index={0}
                    snapPoints={snapPoints2}
                    backgroundStyle={styles.background}
                >
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{fontSize: 22, fontWeight: 800, marginTop: '0%'}}>Update Password</Text>
              <Text style={{fontSize: 15, marginTop: '2%'}}>Please enter your old password and your new password.</Text>
    

                        <View style={{backgroundColor: '#FFFFFF',width: '80%', height: '11%', borderRadius: 5,shadowColor: 'black',shadowOpacity: 0.4, shadowOffset: {width: 2, height: 2},elevation: 8, marginTop:'10%'}}>
                        <TextInput style={{fontSize: 18, color:'#7E7E7E', marginTop: '2%', marginLeft: '2%'}} 
                          placeholder="Current Password"
                          autoCapitalize="none"
                          secureTextEntry={true}
                          autoCorrect={false}
                          textContentType="password"
                          // value={opassword}
                          onChangeText={(text) => setoPassword(text)}/>
                        </View>
                        <View style={{backgroundColor: '#FFFFFF',width: '80%', height: '11%', borderRadius: 5,shadowColor: 'black',shadowOpacity: 0.4, shadowOffset: {width: 2, height: 2},elevation: 8, marginTop:'10%'}}>
                        <TextInput style={{fontSize: 18, color:'#7E7E7E', marginTop: '2%', marginLeft: '2%'}} 
                          placeholder="New Password"
                          autoCapitalize="none"
                          secureTextEntry={true}
                          autoCorrect={false}
                          textContentType="password"
                          // value={npassword}
                          onChangeText={(text) => setnPassword(text)}/>
                        <Text style={styles.errorMessage}>{passwordError}</Text>
                        </View>
                    
                    {/* </KeyboardAvoidingView> */}
                    <TouchableOpacity onPress={() => { update(); 
                      if(isValidPassword(npassword)) {bottomSheetModalRef2.current.close()}}} style={{backgroundColor: '#000000', width: '80%', height: '10%', alignItems: 'center', justifyContent: 'center', marginTop: '10%', borderRadius: 10, shadowColor: 'black', shadowOpacity: 0.6, shadowOffset: {width: 2, height: 2},elevation: 8,}}>
                    <Text style={{color: 'white', fontSize: 21}}>Update</Text>
                    </TouchableOpacity>
              {/* </View> */}
              </View>
            </BottomSheetModal>
            <View style={{height: '1%', backgroundColor: '#E9E9E9', marginTop:'2%', marginBottom: '2%'}} />
            </View>
            :
            <View></View>
          
          }
          




          <TouchableOpacity 
            style={styles.btn}
            onPress={() => onSignOut(navigation)}
          >
            <Text style={styles.text}>Sign Out</Text>
            <View style={{
              height: 40,
              width: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <SignOut width={25} height={25} />
            </View>
            
            {/* <ExpandRight width={40} height={40} /> */}
          </TouchableOpacity>
          
        </View>

        </SafeAreaView>
    );
  // }
}

const styles = EStyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FAFAFA',
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    // HEADER
    titleContainer: {
      paddingHorizontal: "4%",
      paddingTop: "2%",
      paddingBottom: "2%",
      backgroundColor: "#FAFAFA"
      
    },
    titleText: {
        fontSize: "28rem",
    },
    profileContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: "2%",
      marginTop: "10%",
    },
    name: {
      fontSize: "18rem",
      fontWeight: '500',
      marginRight: '10%',
    },
    img: {
      width: "70rem",
      height: "70rem",
      borderRadius: "40rem",
      marginRight: 10,
    },
    editContainer: {
      flexDirection: 'row', 
      justifyContent: 'center', 
      alignItems: 'center'
    },
    edit: {
      fontSize: "16rem",
    },
    box1: {
      backgroundColor: '#FFFFFF',
      width: '94%',
      // height: '12%',
      top: '10%',
      left: '3%',
      borderRadius: 5,
      shadowColor: 'black',
      shadowOpacity: 0.25,
      shadowOffset: {width: 0, height: 4},
      elevation: 8,
      marginVertical: "2%",
      padding: '2%',
    },
    btn: {
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'space-between'
    },
    text: {
      fontSize: "16rem",
      marginLeft: '3.5%',
    },
    errorMessage: {
      color: 'red',
      alignSelf: 'center', // Center-align the error message
      width: '86.11%', // Match the width of the formContainer for consistent alignment
      textAlign: 'center', // Center the text within the component
      marginTop: '3%',
    },
  });

export default StudentProfile;
