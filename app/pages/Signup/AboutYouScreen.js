import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Image, TextInput, Dimensions, ScrollView, Platform, Alert, StatusBar } from 'react-native';
import ContinueButton from './assets/continue.svg';
import StudentCheckMark from './assets/about-you/check-icons/check-icon-student.svg';
import TutorCheckMark from './assets/about-you/check-icons/check-icon-tutor.svg';
import { Notifier, Easing } from 'react-native-notifier';

import Math from './assets/about-you/subjects/math.svg';
import Music from './assets/about-you/subjects/music.svg';
import ComputerScience from './assets/about-you/subjects/computer-science.svg';
import Engineering from './assets/about-you/subjects/engineering.svg';
import Arts from './assets/about-you/subjects/arts.svg';
import Physics from './assets/about-you/subjects/physics.svg';
import Chemistry from './assets/about-you/subjects/chemistry.svg';
import Biology from './assets/about-you/subjects/biology.svg';
import English from './assets/about-you/subjects/english.svg';
import History from './assets/about-you/subjects/history.svg';
import Geography from './assets/about-you/subjects/geography.svg';
import Economics from './assets/about-you/subjects/economics.svg';
import Business from './assets/about-you/subjects/business.svg';
import Accounting from './assets/about-you/subjects/accounting.svg';
import LegalStudies from './assets/about-you/subjects/legal-studies.svg';
import Psychology from './assets/about-you/subjects/psychology.svg';
import Languages from './assets/about-you/subjects/languages.svg';
import Others from './assets/about-you/subjects/others.svg';

import EStyleSheet from 'react-native-extended-stylesheet';

const search = require("../../assets/icons/Search.png");

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, database } from "../../config/firebase";
import { doc, setDoc } from "firebase/firestore"; 
import { getDownloadURL, getStorage, ref, uploadString, uploadBytes } from "firebase/storage";

// Mapping of subject names to their SVG components
const subjectImages = {
  "Math": Math,
  "Arts": Arts,
  "Music": Music,
  "Engineering": Engineering,
  "Physics": Physics,
  "Chemistry": Chemistry,
  "Biology": Biology,
  "English": English,
  "Computer Science": ComputerScience,
  "History": History,
  "Geography": Geography,
  "Economics": Economics,
  "Business": Business,
  "Accounting": Accounting,
  "Legal Studies": LegalStudies,
  "Psychology": Psychology,
  "Languages": Languages,
  "Other": Others,
};

// REM stylesheet
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});

const AboutYouScreen = ({ route }) => {
  const navigation = useNavigation();

  const { name, email, password, role, qualification, uri, description, stage, gpa, gender } = route.params;

  const onHandleSignup = () => {
    if (email !== "" && password !== "") {
      createUserWithEmailAndPassword(auth, email, password)
        .then(() => console.log("Signup success"))
        .catch((err) => Alert.alert("Login error", err.message));
    }
  }
  
  const createUser = async () => {
    await setDoc(doc(database, "Users", email), {
      email: email,
      student: role === "student"
    });
  
    if (role === "student") {
      createStudent();
    } else {
      createTutor();
    }
    if (password !== null) {
      onHandleSignup();
    }
  }

  const createStudent = async () => {
    await setDoc(doc(database, "Student", email), {
      Chats: [],
      Fname: name.split(" ")[0],
      Lname: name.split(" ")[1] ? name.split(" ")[1] : "",
      Subjects: clickedSubjects,
      ProfilePic: await uploadImageAsync(),
      YearLevel: stage,
      TutorGender: "Any",
    });
  }

  const createTutor = async () => {
    await setDoc(doc(database, "Tutor", email), {
      Chats: [],
      Fname: name.split(" ")[0],
      Lname: name.split(" ")[1] ? name.split(" ")[1] : "",
      Subjects: clickedSubjects,
      Languages: ["English"],
      TutorFor: ["Stage 1"],
      _id: email,
      Qualification: qualification,
      ProfilePic: await uploadImageAsync(),
      Bio: description,
      GPA: gpa,
      Rating: 5,
      Gender: gender,
    });
  }

  async function uploadImageAsync() {
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
  
    const fileRef = ref(getStorage(), `avatar/${email}.png`);
    const result = await uploadBytes(fileRef, blob);
  
    // We're done with the blob, close and release it
    blob.close();
  
    return await getDownloadURL(fileRef);
  }
  
  const [clickedSubjects, setClickedSubjects] = useState([]);
  const [searchText, setSearchText] = useState('');

  const handleSubjectClick = (subject) => {
    if (clickedSubjects.includes(subject)) {
      setClickedSubjects(prevState => prevState.filter(s => s !== subject));
    }else{
      setClickedSubjects(prevState => [...prevState, subject]);
    }
  }
  // console.log(clickedSubjects);

  const filteredSubjects = Object.keys(subjectImages).filter(subject =>
    subject.toLowerCase().includes(searchText.toLowerCase())
  );

  const continueHandler = () => {
    if (clickedSubjects.length > 0) {
      createUser();
    }else{
      // notification if no subject selected
      Notifier.showNotification({
        title: 'Error',
        description: 'You need to select at least one subject!',
        duration: 3000,
        showAnimationDuration: 800,
        showEasing: Easing.bounce,
        onHidden: () => console.log('Hidden'),
        onPress: () => console.log('Press'),
        hideOnPress: false,
        translucentStatusBar: true,
        componentProps: {
          titleStyle: { color: 'red' }
        },
      });
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>
        {role === 'student' ? "What do you want to learn?" : "What do you want to teach?"}
      </Text>

      {/* Search bar */}
      <View style={styles.searchContainer}>  
        <Image source={search} style={styles.searchIcon} />
        <TextInput 
          style={styles.searchText}
          placeholder="Search subjects..."
          placeholderTextColor="#7A7F8E"
          onChangeText={text => setSearchText(text)}
        />
      </View>

      {/* Subjects */}
      <ScrollView contentContainerStyle={styles.subjectsContainer} style={styles.subjectsScrollView}>
        {filteredSubjects.map((subject, index) => (
          <View style={[styles.subjectWrapper, index % 2 === 0 ? { marginRight: 'auto' } : { marginLeft: 'auto' }]} key={subject}>  
            <TouchableOpacity 
              style={[
                styles.subjectsButton,
                clickedSubjects.includes(subject) ? {opacity: 0.8} : {}
              ]}
              onPress={() => handleSubjectClick(subject)}
            >
              <View style={styles.roundedBox}>
                {/* SVG image */}
                <View pointerEvents="none">
                  {React.createElement(subjectImages[subject])}
                </View>
                {clickedSubjects.includes(subject) && (
                  <View style={styles.checkmarkOverlay}>
                    {role === 'student' ? <StudentCheckMark /> : <TutorCheckMark />}
                  </View>
                )}
                {/* <Text style={styles.subjectsText}>{subject}</Text> */}
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={styles.continueButtonContainer}>
        <TouchableOpacity onPress={continueHandler}>
          <ContinueButton style={styles.continueButton} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerText: {
    flexShrink: 0,
    color: "#000",
    fontFamily: "Inter-Bold",
    fontSize: 32,
    fontWeight: "700",
    marginLeft: 31,
    marginTop: Platform.OS === 'android' ? '11%' : 0, // Add top margin for Android to push the header below the back button.
  },
  continueButtonContainer: {
    // flex: 1,
    // justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: "10%",
  },
  continueButton: {
    alignSelf: "center",
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#edeff0",
    marginHorizontal: "3.5%",
    marginVertical: "2%",
    height: "35rem",
    justifyContent: "center",
    borderRadius: 10,
    width: "90%",
  },
  searchText: {
    marginHorizontal: "2%",
    fontSize: "14rem",
    fontWeight: "300",
    opacity: 10,
    width: "90%",
  },
  searchIcon: {
    height: "22rem",
    width: "20rem",
    marginLeft: "8%",
    alignSelf: "center",
  },
  subjectsScrollView: {
    marginBottom: '2.5%',
  },
  subjectsContainer: {
    flexDirection: 'row', 
    flexWrap: 'wrap',
    justifyContent: 'flex-start',  // Align subjects to the left
    alignItems: 'center',      // Center subjects vertically
    paddingHorizontal: '2%',   // Add some padding to the sides to ensure subjects don't touch the edges
  },
  subjectWrapper: {
    width: '45%',              // Each subject occupies 45% of the container's width, making them closer
    justifyContent: 'center',  // Center each subject horizontally within its wrapper
    alignItems: 'center',      // Center each subject vertically within its wrapper
    margin: '1.5%',            // Reduced margin for closer spacing
  },
  roundedBox: {
    justifyContent: 'center',  // Center content vertically
    alignItems: 'center',      // Center content horizontally
  },
  checkmarkOverlay: {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: [{ translateX: -17 }, { translateY: -17 }],
  backgroundColor: 'rgba(255, 255, 255, 0.7)', // semi-transparent white
  borderRadius: 20, // to make it rounded
  },
});

export default AboutYouScreen;