import React, { useState, useLayoutEffect, useEffect } from "react"
import { View, SafeAreaView, Text, TouchableOpacity, TextInput, Dimensions, Image, ScrollView, ActivityIndicator } from "react-native"
import EStyleSheet from "react-native-extended-stylesheet";
import { useNavigation } from "@react-navigation/native";

import * as ImagePicker from 'expo-image-picker';

import {
    doc,
    getDoc,
    updateDoc,
  } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { auth, database } from "../config/firebase";

// REM stylesheet
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});

import { AntDesign } from '@expo/vector-icons'; 

export default Edit = ({ route }) => {
    const { isStudent } = route.params;
    const userEmail = auth?.currentUser?.email;

    const navigation = useNavigation();

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [3, 3],
          quality: 1,
        });
        // console.log(result);
        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    }

    // const uri = "https://firebasestorage.googleapis.com/v0/b/study-pal-7752b.appspot.com/o/avatar%2Fprofile_icon.png?alt=media&token=2d7f8c5d-af1f-4c19-a72f-a30925cd19a8";
    const [selectedImage, setSelectedImage] = useState(null);
    const [gpa, setGpa] = useState("");
    const [selectedG, setSelectedG] = useState("");
    const gender = ["Female", "Male"];
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const applyChanges = () => {
        if (isStudent) {
            updateStudent();
        } else {
            updateTutor();
        }
        navigation.goBack();
    }
    
    const updateStudent = async () => {
        await updateDoc(doc(database, "Student", userEmail), {
            Fname: name.split(" ")[0],
            Lname: name.split(" ")[1] ? name.split(" ")[1] : "",
            ProfilePic: await uploadImageAsync(),
        });
    }
    
    const updateTutor = async () => {
        await updateDoc(doc(database, "Tutor", userEmail), {
            Fname: name.split(" ")[0],
            Lname: name.split(" ")[1] ? name.split(" ")[1] : "",
            ProfilePic: await uploadImageAsync(),
            Gender: selectedG,
            GPA: gpa,
        });
    }

    useEffect(() => {
      console.log("Loading profile data...");
      if (isStudent) {
        const userRef = doc(database, "Student", userEmail);
        getDoc(userRef)
        .then(snapshot => {
          // console.log(snapshot.data());
          setName(snapshot.get("Fname") + " " + snapshot.get("Lname"));
          setSelectedImage(snapshot.get("ProfilePic"));
          setIsLoading(false);
        })
      } else {
        const userRef = doc(database, "Tutor", userEmail);
        getDoc(userRef)
        .then(snapshot => {
          // console.log(snapshot.data());
          setName(snapshot.get("Fname") + " " + snapshot.get("Lname"));
          setSelectedImage(snapshot.get("ProfilePic"));
          setGpa(snapshot.get("GPA"));
        //   console.log(snapshot.get("GPA"))
          setSelectedG(snapshot.get("Gender"));
          setIsLoading(false);
        })
      }
    }, []);

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
          xhr.open("GET", selectedImage, true);
          xhr.send(null);
        });
      
        const fileRef = ref(getStorage(), `avatar/${userEmail}.png`);
        const result = await uploadBytes(fileRef, blob);
      
        // We're done with the blob, close and release it
        blob.close();
      
        return await getDownloadURL(fileRef);
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "",
            headerLeft: () => (
                <TouchableOpacity style={styles.iconContainer} onPress={() => {
                    if (navigation.canGoBack()) {
                        navigation.goBack();
                      }
                    }}>
                    <AntDesign name="left" size={24} color="black" style={styles.backIcon} />
                </TouchableOpacity>
            ),
            headerStyle: { backgroundColor: '#FAFAFA' },
            headerShadowVisible: false,
        });
    })

    if (isLoading) {
      return (
          <View style={{height: "100%", width: "100%", backgroundColor: "#FAFAFA", justifyContent: "center"}}>
              <ActivityIndicator size="large" color="orange" />
          </View>
        )
    }


    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headerText}>Edit Details</Text>
            <ScrollView style={{ height: "100%"}}>
                <View style={styles.profileContainer}> 
                    <Image
                        source={{ uri: selectedImage }}
                        style={{ width: 120, height: 120, borderRadius: 100}}
                        resizeMode="contain"
                        overflow="hidden"
                    />
                    <TouchableOpacity style={styles.btn}
                        onPress={pickImage}
                    >
                        <Text>Upload Image</Text>
                    </TouchableOpacity>
                </View>

                <View style={{
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <View style={[styles.inputContainer, {marginTop: "10%"}]}>
                        <Text style={styles.label}>Name</Text>
                        <TextInput 
                            style={[styles.qualification, {fontWeight: "400"}]}
                            onChangeText={(text) => setName(text)}
                            value={name}
                            placeholder='Anna Smith'
                            maxLength={30}
                        />
                    </View>
                

                {
                    isStudent ? null :
                    <View style={styles.inputContainer}>
                        <View style={[{
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }]}>
                            <View style={{height: "100%"}}>
                                <Text style={styles.label}>Your GPA</Text>
                                <View style={styles.inputBox}>
                                    <TextInput 
                                        style={[{width: "80%"}, styles.text]}
                                        onChangeText={(text) => setGpa(text)}
                                        value={gpa.toString()}
                                        placeholder='GPA'
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>

                            <View>
                                <Text style={styles.label}>Your Gender</Text>
                                <View style={styles.btnContainer}>
                                {gender.map(((g, index) => (
                                    <TouchableOpacity
                                        onPress={() => setSelectedG(g)}
                                        style={[styles.button, { backgroundColor: selectedG==g ? "#FF8C39" : "#E5E9EC" }]}
                                        key={index}
                                    >
                                        <Text style= {[styles.buttonText, { color: selectedG==g ? "#FFFFFF" :"black" }]}>{g}</Text>
        
                                    </TouchableOpacity>
                                )))}
                                </View>
                            </View>
                        </View>
                    </View>
                }
                </View>
                
                <View style={[styles.applyBtn, {marginTop: isStudent ? "70%" : "50%"}]}>
                    <TouchableOpacity 
                        onPress={() => applyChanges()}
                    >
                        <Text style={styles.applyText}>Apply Changes</Text>
                    </TouchableOpacity>
                </View>
                    
            
            </ScrollView>
            
            
            
        </SafeAreaView>
    )
}

const styles = EStyleSheet.create({
    container: {
      flex: 1,
    //   paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: "#FAFAFA"
    },
    headerText: {
        paddingHorizontal: "4%",
        backgroundColor: "#FAFAFA",
        fontSize: "28rem",
    },
    profileContainer: {
        width: "100%",
        justifyContent: "center", 
        alignItems: "center",
        marginVertical: "5%",
        marginTop: "20%",
    },
    btn: {
        backgroundColor: "#E5E9EC",
        padding: "8rem",
        borderRadius: 10,
        marginTop: "2%",
        elevation: 3,
    },
    qualification: {
        fontWeight: "600",
        fontSize: "16rem",
        backgroundColor: "#E5E9EC",
        padding: "3%",
        borderRadius: 7,
        // marginTop: "10%",
        width: "100%",
        color: "#33363F",
    },
    inputBox: {
        backgroundColor: "#E5E9EC",
        padding: "6rem",
        borderRadius: 7,
        width: "70%",
        color: "#33363F",
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: "14rem",
    },
    introText: {
        color: "#33363F",
        // margin: "1%",
        backgroundColor: "#E5E9EC",
        padding: "5%",
        borderRadius: 7,
        // marginTop: "3%",
    },
    inputContainer: {
        // flex: 1,
        width: "80%",
        marginVertical: "3%",
        // marginTop: "20%",
    },
    label: {
        marginLeft: "2%",
        fontSize: "16rem",
        fontWeight: "500"
    },
    btnContainer: {
        flexWrap: 'wrap',
        flexDirection: "row",
        justifyContent: "flex-start",
        marginTop: "5%",
    },
    button: {
        marginHorizontal: "1%",
        marginVertical: "2%",
        borderRadius: 20,
        paddingVertical: "3%",
        paddingHorizontal: "7%",
        justifyContent: 'center',
        alignItems: 'center',

    },
    buttonText: {
        color: 'white',
        fontWeight: 'regular', 
        fontSize: "16rem",
        textAlign: "center",
        // paddingHorizontal: "1.5%",
        
    },
    iconContainer: {
        position: "absolute",
        width: "50rem",
        height: "50rem",
        left: "1%",
        justifyContent: "center",
        alignItems: "center",
    },
    backIcon: {
        width: "30rem",
        height: "30rem",
    },
    applyBtn: {
        backgroundColor: 'black',
        alignItems: 'center', 
        justifyContent: 'center',
        alignSelf: 'center',
        // position: "absolute",
        // bottom: "100%",
        bottom: "15%",
        borderRadius: 25, 
        shadowColor: 'black', 
        shadowOpacity: 0.8, 
        elevation: 8,
        width: "85%",
        padding: "3%",
    },
    applyText: {
        fontSize: "18rem", 
        color: "white",
        fontWeight: "600" 
    },
})
