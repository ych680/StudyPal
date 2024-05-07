import React, { useState } from "react"
import { View, SafeAreaView, Text, TouchableOpacity, TextInput, Dimensions, Image, ScrollView, StatusBar } from "react-native"
import EStyleSheet from "react-native-extended-stylesheet"
import ContinueButton from './assets/continue.svg';
import { useNavigation } from "@react-navigation/native";

import * as ImagePicker from 'expo-image-picker';

// REM stylesheet
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});

export default Details = ({ route }) => {
    const { name, email, password, role } = route.params;
    const navigation = useNavigation();
    const uri = "https://firebasestorage.googleapis.com/v0/b/study-pal-7752b.appspot.com/o/avatar%2Fprofile_icon.png?alt=media&token=2d7f8c5d-af1f-4c19-a72f-a30925cd19a8";
    const [selectedImage, setSelectedImage] = useState(uri);

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

    const [qualification, setQualification] = useState("");
    const [description, setDescription] = useState("");
    const [gpa, setGpa] = useState(null);

    const [selectedYL, setSelectedYL] = useState("Stage 1");
    const year = ["Stage 1", "Stage 2", "Stage 3", "Stage 4"];

    const [selectedG, setSelectedG] = useState("");
    const gender = ["Female", "Male"];

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headerText}>Details</Text>
            <ScrollView style={{height: "100%"}}>
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

                    {role == "tutor" ?
                    <>
                        <View style={[styles.inputContainer, {marginTop: "10%"}]}>
                            <Text style={styles.label}>Title</Text>
                            <TextInput 
                                style={styles.qualification}
                                onChangeText={(text) => setQualification(text)}
                                value={qualification}
                                placeholder='Maths and Statistics'
                                multiline
                                maxLength={100}
                            />
                        </View>

                        <View style={[styles.inputContainer, {
                            flex:1,
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }]}>
                            <View style={{height: "100%"}}>
                                <Text style={styles.label}>Your GPA</Text>
                                <View style={styles.inputBox}>
                                    <TextInput 
                                        style={[{width: "80%"}, styles.text]}
                                        onChangeText={(text) => setGpa(text)}
                                        value={gpa}
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

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Introduction</Text>
                            <TextInput 
                                style={[styles.introText, styles.text]}
                                multiline
                                placeholder='Introduce yourself ...'
                                onChangeText={(text) => setDescription(text)}
                                value={description}
                            />
                        </View>
                    </>


                    :
                    <>
                        <View style={[styles.inputContainer, {marginTop: "10%"}]}>
                            <Text style={styles.label}>Year Level</Text>
                            <View style={styles.btnContainer}>
                            {year.map(((level, index) => (
                                <TouchableOpacity
                                    onPress={() => setSelectedYL(level)}
                                    style={[styles.button, { backgroundColor: selectedYL==level ? "#0AAAC0" : "#E5E9EC" }]}
                                    key={index}
                                >
                                    <Text style= {[styles.buttonText, { color: selectedYL==level ? "#FFFFFF" :"black" }]}>{level}</Text>
    
                                </TouchableOpacity>
                            )))}
                            </View>
                        </View>
                    </>
                    }
                    
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => navigation.navigate("AboutYou", {
                    name: name, 
                    email: email, 
                    password: password, 
                    role: role, 
                    qualification: qualification, 
                    uri: selectedImage, 
                    description: description, 
                    stage: selectedYL, 
                    gpa: gpa,
                    gender: selectedG,
                     })}>
                <ContinueButton
                    style={styles.continueButton}/>
                </TouchableOpacity>
            </View>
            </ScrollView>
            
            
        </SafeAreaView>
    )
}

const styles = EStyleSheet.create({
    container: {
      flex: 1,
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    headerText: {
      flexShrink: 0,
      color: '#000',
      fontFamily: 'Inter-Bold', 
      fontSize: 32,
      fontWeight: '700', // legacy of font style from figma, unnecessary but will keep for context
      marginLeft: 31,
      marginTop: Platform.OS === 'android' ? '11%' : 0, 
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
        flex: 1,
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
        // marginTop: "5%",
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
    buttonContainer: {
    //   flex: 1,
    //   justifyContent: 'flex-end',
    //   alignItems: 'center',
    //   marginBottom: "10%",
        elevation: 8,
    },
    continueButton: {
      alignSelf: 'center',
      marginTop: "18%",
      
    },
  })
  