import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, SafeAreaView, TextInput, Platform, StatusBar, Alert, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchSignInMethodsForEmail, GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from '../../config/firebase';
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import EStyleSheet from 'react-native-extended-stylesheet';
import ContinueButton from './assets/continue.svg';
import NameIcon from './assets/nameIcon.svg';
import EmailIcon from './assets/email-icon.svg';
import PasswordIcon from './assets/password-icon.svg';
import Passwordshow from './assets/passwordshow.svg';
import Passwordhide from './assets/passwordhide.svg';
import GoogleSignup from './assets/google-signup.svg';
import { doc, getDoc } from 'firebase/firestore';
import { database } from '../../config/firebase';

// REM stylesheet
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});

const SignupPage = () => {
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (email !== "") {
    fetchSignInMethodsForEmail(auth, email)
      .then(response => {
        if (response.length > 0) {
          Alert.alert("Email address already registered")
        }
      })
      .catch(err => console.log(err))
  }

  async function onGoogleButtonPress() {
    console.log("Entering onGoogleButtonPress");
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const { idToken, user } = await GoogleSignin.signIn();

    let userName = user.displayName;

    if (!userName) {
      userName = user.displayName || "Anonymous Name";
      navigation.navigate("Role", {
        name: userName,
        email: user.email,
        password: null,
      });
    }

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
          name: userName,
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
  
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

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

  const isFormValid = () => {
    return name && isValidEmail(email) && isValidPassword(password);
  };

  const handleContinuePress = () => {
    if (!name) {
      console.log("Name is required.");
      setNameError("Name is required.");
    }else{
      setNameError('');
    }

    if (!isValidEmail(email)) {
      console.log("Invalid email format.");
      setEmailError("Invalid email format.");
    }else{
      setEmailError('');
    }

    if (!password) {
      console.log("Password cannot be empty");
      setPasswordError("Password cannot be empty");
    }else{
      setPasswordError('');
    }

    if (name && isValidEmail(email) && isValidPassword(password)) {
      navigation.navigate("Role", {name: name, email: email, password: password});
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.textStyle}>Sign Up</Text>
      <View style={styles.formContainer}>
        {/* <Text style={styles.inputHeader}>Name</Text> */}
        <View style={styles.inputWrapper}>
          <NameIcon style={styles.iconStyle}/>
          <TextInput style={styles.inputField}
            placeholder='Name'
            autoCapitalize='words'
            textContentType='name'
            value={name}
            onChangeText={(text) => setName(text)}
          />
        </View>
        <Text style={styles.errorMessage}>{nameError}</Text>

        {/* <Text style={styles.inputHeader}>Email</Text> */}
        <View style={styles.inputWrapper}>
          <EmailIcon style={styles.iconStyle}/>
          <TextInput style={styles.inputField}
            placeholder='Email'
            autoCapitalize='none'
            keyboardType='email-address'
            textContentType='emailAddress'
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <Text style={styles.errorMessage}>{emailError}</Text>

        {/* <Text style={styles.inputHeader}>Password</Text> */}
        <View
          style={styles.inputWrapper}>
          <PasswordIcon style={styles.iconStyle} />
          <TextInput
            style={styles.inputField}
            placeholder="Password"
            autoCapitalize="none"
            secureTextEntry={!showPassword}
            autoCorrect={false}
            textContentType="password"
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity onPress={togglePasswordVisibility}>
            {showPassword ? (<Passwordhide style={styles.passwordStyle}/>) : (<Passwordshow style={styles.passwordStyle}/>)}
          </TouchableOpacity>
        </View>
        <Text style={styles.errorMessage}>{passwordError}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", alignSelf: "center"}}>
            <Text style={{color: "gray", fontWeight: "400", fontSize: 14}}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={{color: "#f57c00", fontWeight: "600", fontSize: 14}}>Log In</Text>
            </TouchableOpacity>
        </View>
      </View>
      <View style={styles.signupContainer}>
        <TouchableOpacity onPress={handleContinuePress}>
          <ContinueButton style={styles.continueButton} />
        </TouchableOpacity>
        <View style={styles.orContainer}>
          <View style={styles.horizontalLine} />
          <Text style={styles.orText}>Or</Text>
          <View style={styles.horizontalLine} />
        </View>
        <TouchableOpacity onPress={() => onGoogleButtonPress().then(() => console.log('Signed in with Google!'))}>
          <GoogleSignup style={styles.googleSignup} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = EStyleSheet.create({
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
    bottom: Platform.OS === 'android' ? '9.5%' : '15%', // Adjust bottom margin for Android
    left: 0,
    right: 0,
    alignItems: 'center',  // Center the button horizontally
    justifyContent: 'space-between',
    height: '20%'
},
  inputHeader: {
    marginBottom: '3%',
    fontFamily: 'Inter-SemiBold',
    fontStyle: 'normal',
    alignSelf: 'flex-start',
    marginLeft: '5%'
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
    fontSize: "16rem", 
    fontWeight: '400',
    padding: "5%"
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
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
    marginBottom: 10, // Some space between the error message and the next input field
  },
  passwordStyle:{
    width: 24,
    height: 24,
    right:12,
    opacity: 0.8
  },
})

export default SignupPage;
