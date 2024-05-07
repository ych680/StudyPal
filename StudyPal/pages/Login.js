import React, { useState, useEffect } from "react";
import { Text, View, Button, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar, Alert, Dimensions } from "react-native";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential, fetchSignInMethodsForEmail } from "firebase/auth";
import { auth } from "../config/firebase";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useNavigation } from '@react-navigation/native';
import ContinueButton from './Signup/assets/continue.svg';
import EmailIcon from './Signup/assets/email-icon.svg';
import PasswordIcon from './Signup/assets/password-icon.svg';
import Googlelogin from '../assets/google-login.svg';
import Passwordshow from './Signup/assets/passwordshow.svg';
import Passwordhide from './Signup/assets/passwordhide.svg';
import EStyleSheet from "react-native-extended-stylesheet";
import { doc, getDoc } from 'firebase/firestore';
import { database } from '../config/firebase';
// REM stylesheet
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});

const Login = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isValidPassword = (password) => {
        // check minimum length
        if (password.length < 8) {
            setPasswordError("You need to enter your password.");
            return false;
        }
        setPasswordError('');
        return true;
    };

    useEffect(() => {
        if (email !== "") {
            isValidEmail(email);
        }
        if (password !== "") {
            isValidPassword(password);
        }
    }, [email, password]);

    const onHandleLogin = () => {
        if (email !== "" && password !== "") {
            if (!isValidEmail(email)) {
                setEmailError("Invalid email format.");
            } else {
                setEmailError('');
                if (!isValidPassword(password)) {
                    setPasswordError("You need to enter your password.");
                } else {
                    setPasswordError('');
                    signInWithEmailAndPassword(auth, email, password)
                        .then(() => console.log("Login success"))
                        .catch((err) => Alert.alert("Login error", err.message));
                }
            }
        } else {
            if (email === "") {
                setEmailError("Email is required.");
            }
            if (password === "") {
                setPasswordError("Password is required.");
            }
        }
    }

    async function onGoogleButtonPress() {
        // Check if your device supports Google Play
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        // Get the users ID token
        const { idToken, user } = await GoogleSignin.signIn();
      
        // Create a Google credential with the token
        const googleCredential = GoogleAuthProvider.credential(idToken);
      
        // Sign-in the user with the credential
        return signInWithCredential(auth, googleCredential).then(async (result) => {
          console.log("Signed in with Google credential");
  
          const userRef = doc(database, "Users", result.user.email);
          const userDoc = await getDoc(userRef);

          if (!userDoc.exists) {
            console.log("Navigating to Role screen");
            navigation.navigate("Role", {
              name: user.displayName || "Anonymous Name",
              email: user.email,
              password: null,
            });
          } else {
            console.log("User already exists in Firestore");
            // Check if the user has provided necessary information, like Role, Subjects and YearLevel.
            // If not, navigate to RoleScreen
            const userData = userDoc.data();
            if (
              userData === undefined ||
              userData.student === undefined ||
              userData.student === null ||
              userData.subjects === undefined ||
              userData.subjects === null ||
              userData.yearLevel === undefined ||
              userData.yearLevel === null
            ) {
              // checks if 'student', 'subjects' and 'yearLevel' fields are missing or null
              navigation.navigate("Role", {
                name: userData?.name || "Anonymous Name",
                email: userData?.email || user.email,
                password: null,
              });
            }
          }  
        }).catch(error => {
          console.error("Error in signInWithCredential:", error);
        });
      }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.textStyle}>Log In</Text>
            <View style={styles.formContainer}>
                {/* <Text style={styles.inputHeader}>Email Address</Text> */}
                <View style={styles.inputWrapper}>
                    <EmailIcon style={styles.iconStyle}/>
                    <TextInput style={styles.inputField}
                        placeholder='Email Address'
                        autoCapitalize='none'
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                    />
                </View>
                <Text style={styles.errorMessage}>{emailError}</Text>
                {/* <Text style={styles.inputHeader}>Password</Text> */}
                <View style={styles.inputWrapper}>
                    <PasswordIcon style={styles.iconStyle}/>
                    <TextInput style={styles.inputField}
                        placeholder='Password'
                        autoCapitalize='none'
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                    />
                    <TouchableOpacity onPress={togglePasswordVisibility}>
                        {showPassword ? (<Passwordhide style={styles.passwordStyle}/>) : (<Passwordshow style={styles.passwordStyle}/>)}
                    </TouchableOpacity>
                </View>
                <Text style={styles.errorMessage}>{passwordError}</Text>
                <View style={{ flexDirection: "row", alignItems: "center", alignSelf: "center", marginTop: "3%"}}>
                    <Text style={{color: "gray", fontWeight: "400", fontSize: 14}}>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                        <Text style={{color: "#f57c00", fontWeight: "600", fontSize: 14}}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.signupContainer}>
                <TouchableOpacity onPress={onHandleLogin}>
                    <ContinueButton style={styles.continueButton} />
                </TouchableOpacity>
                <View style={styles.orContainer}>
                    <View style={styles.horizontalLine} />
                    <Text style={styles.orText}>Or</Text>
                    <View style={styles.horizontalLine} />
                </View>
                <TouchableOpacity onPress={() => onGoogleButtonPress().then(() => console.log('Signed in with Google!'))}>
                    <Googlelogin style={styles.Googlelogin}/>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = EStyleSheet.create({
    passwordStyle:{
        width: 24,
        height: 24,
        right:12,
        opacity: 0.8
    },
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    textStyle: {
        flexShrink: 0,
        color: '#000',
        fontFamily: 'Inter-Bold', // or use Inter; looks pretty stylish to me (gabriel)
        fontSize: 32,
        fontWeight: '700', // legacy of font style from figma, unnecessary but will keep for context
        marginLeft: '8%',
        marginTop: Platform.OS === 'android' ? '11%' : 0, // Add top margin for Android to push the header below the back button.
    },
    continueButton: {
        width: '75%',
        height: '6%',
        flexShrink: 0,
        paddingBottom: '20%',
    }, 
    signupContainer: {
        position: 'absolute', // Position the button at the absolute bottom
        bottom: '15%', // Slight margin from the bottom
        left: 0,
        right: 0,
        alignItems: 'center',  // Center the button horizontally
        justifyContent: 'space-between',
        height: '15%'
    },
    inputHeader: {
        marginBottom: '3%',
        fontFamily: 'Inter-SemiBold',
        fontStyle: 'normal',
        alignSelf: 'flex-start',
        marginLeft: '5%',
        marginTop: "5%",
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '50%',
        width: '86.11%',
        alignSelf: 'center'
    },
    inputField: {
        flex: 1, // Allow the input field to take up the remaining space in the row
        borderRadius: 15, // Adjust this to make the input field fit seamlessly within the wrapper
        backgroundColor: 'transparent', // Ensure the input field doesn't have its own background
        // paddingLeft: '4%', // Some space after the icon, adjust as needed
        // paddingTop: '1%',
        // paddingBottom: '0.5%',
        // fontSize: 16,
        // color:'#7E7E7E', 
        fontSize: "16rem", 
        fontWeight: '400',
        padding: "5%"
      },
      inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        // height: '11%',
        borderRadius: 20,
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 8,
        marginBottom: "1%",
        paddingLeft: '5%', // This will give some space on the left of the icon
      },
    orContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10, // Adjust as needed
    },
    horizontalLine: {
        flex: 1, // This will make the lines take up all available space
        height: 1, // Thickness of the line
        backgroundColor: '#000', // Color of the line
        marginHorizontal: 20, // Space between the line and the "Or" text
    },
    orText: {
        fontFamily: 'Inter',
        fontSize: 16,
    },
    googleSignup: {
        paddingTop: '10%',
    },
    errorMessage: {
        color: 'red',
        alignSelf: 'center', // Center-align the error message
        width: '86.11%', // Match the width of the formContainer for consistent alignment
        textAlign: 'center', // Center the text within the component
        marginBottom: '1%', // Some space between the error message and the next input field
    },
})

export default Login;


