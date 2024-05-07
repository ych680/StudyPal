import { View, Text, ScrollView, Image, TextInput, TouchableOpacity, FlatList, Dimensions, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import React, { Fragment, useEffect, useLayoutEffect, useState } from 'react'
import EStyleSheet from 'react-native-extended-stylesheet';

import student from "../data/student"
import tutor from "../data/tutor"

// Firebase
import {
    getDoc,
    collection,
    doc,
    updateDoc,
    onSnapshot
} from "firebase/firestore";
import { auth, database } from "../config/firebase";

// Icons & images
import Star from "../assets/icons/Star.svg";
const dell = require("../assets/icons/Dell.png");
const add = require("../assets/icons/Add.png");

// REM stylesheet
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});

export default function HomepageTutor () {

    const navigation = useNavigation();

    const userEmail = auth.currentUser.email;

    // Dummy data
    const students = student;
    const Anna = tutor[0]

    const [data, setData] = useState({});

    const [isLoading, setIsLoading] = useState(true);

    const [isEditingBio, setIsEditingBio] = useState(false);
    const [isEditingTags, setIsEditingTags] = useState(false);
    const [isEditingIntro, setIsEditingIntro] = useState(false);

    const [addFor, setAddFor] = useState(false);
    const [addLanguage, setAddLanguage] = useState(false);
    const [addSubject, setAddSubject] = useState(false);

    const [qualification, setQualification] = useState("");
    const [description, setDescription] = useState("");
    const [stage, setStage] = useState("");
    const [language, setLanguage] = useState("");
    const [subject, setSubject] = useState("");

    const [tutorFor, setTutorFor] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [subjects, setSubjects] = useState([]);

    const stages = ["Stage 1", "Stage 2", "Stage 3", "Stage 4"];

    let newValue = null;

    // Retreive data from Firebase
    useEffect(() => {
        setIsLoading(true);
        const tutorRef = doc(database, "Tutor", userEmail);
        onSnapshot(tutorRef, snapshot => {
            console.log("Loading data...");
            setData(snapshot.data());
            setQualification(snapshot.get("Qualification"));
            setDescription(snapshot.get("Bio"));
            setTutorFor(snapshot.get("TutorFor"));
            setLanguages(snapshot.get("Languages"));
            setSubjects(snapshot.get("Subjects"));
            setIsLoading(false);
        })
    }, []);

    const updateBio = () => {
        const detailsRef = doc(database, "Tutor", userEmail);
        updateDoc(detailsRef, {
            Qualification: qualification,
            TutorFor: tutorFor,
            Languages: languages,
        })
    }

    const updateSubjects = () => {
        const subjectsRef = doc(database, "Tutor", userEmail);
        updateDoc(subjectsRef, {
            Subjects: subjects,
        })
    }

    const updateIntro = () => {
        const introRef = doc(database, "Tutor", userEmail);
        updateDoc(introRef, {
            Bio: description,
        });
    }

    // Custom Header
    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => (
                <Fragment>
                    <SafeAreaView edges={["top"]} style={{backgroundColor: "#FAFAFA"}} />
                    <View style={styles.titleContainer} >
                        <Text style={styles.titleText}>Hi {data?.Fname}</Text>
                    </View>
                </Fragment>
            )
        })
    }, [data]);

    if (isLoading) {
        return (
            <View style={{height: "100%", width: "100%", backgroundColor: "#FAFAFA", justifyContent: "center"}}>
                <ActivityIndicator size="large" color="orange" />
            </View>
        )
    }

    return (
        <SafeAreaProvider>
        <SafeAreaView style={styles.container} >

            <ScrollView>

                {/* Profile container */}
                <View style={styles.profileContainer}> 
                    <Image
                        source={{ uri: data.ProfilePic }}
                        style={{ width: 90, height: 90, borderRadius: 100 }}
                    />

                    <Text style={{fontSize: 16, fontWeight: "600", margin: 5}}>{data.Fname} {data.Lname}</Text>

                    {/* Rating */}
                    <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                        {Array.apply(null, { length: data.Rating }).map(((rating, index) => (
                            <Star 
                                style={{
                                    width: 13,
                                    height: 13,
                                    margin: 1
                                }}
                                key={index}
                            />
                        )))}

                        <Text> ({data.Rating}) </Text>
                    </View>
                </View>

                {/* Details container */}
                <View style={styles.blockContainer}>
                    { // Editing Bio conditional block
                        isEditingBio
                        ?   // If editing
                            // {/* Header and edit button container */}
                            <View >
                                <View style={styles.heading}>
                                    {/* <Text style={styles.header}>Biography</Text> */}
                                </View>

                                <View style={styles.block}>
                                    {/* Editing Title */}
                                    <TextInput 
                                        style={[styles.qualification, {backgroundColor: "#E5E9EC"}]}
                                        onChangeText={(text) => setQualification(text)}
                                        value={qualification}
                                        placeholder='Title'
                                        multiline
                                        maxLength={100}
                                    />

                                    <View style={[styles.infoContainer, {backgroundColor: "#E5E9EC"}]}>
                                        <Text style={styles.infoText}>Tutors for:</Text>
                                        <View style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            flexWrap: 'wrap',
                                        }}>
                                            {stages?.map((stage, index) => {
                                                if (tutorFor.includes(stage)) {
                                                    return (
                                                        <View style={styles.editDetails} key={index}>
                                                            <Text style={styles.infoText}>{stage}</Text>
                                                            <TouchableOpacity style={styles.dellContainer}
                                                                onPress={() => {
                                                                    
                                                                    console.log("deleting", tutorFor.indexOf(stage));
                                                                    newValue = tutorFor.slice(0);
                                                                    newValue.splice(tutorFor.indexOf(stage), 1);
                                                                    setTutorFor(newValue);
                                                                }}
                                                            >
                                                                <Image source={dell} style={styles.dell} />
                                                            </TouchableOpacity>
                                                        </View>
                                                    )
                                                }
                                                })}

                                            {/* Editing Tutor For condition block */}
                                            {addFor
                                            ? null
                                            : // if not editing, show add button
                                            <TouchableOpacity style={styles.addContainer}
                                                onPress={() => {
                                                    setAddFor(true)
                                                }}
                                            >
                                                <Image source={add} style={styles.add} />
                                            </TouchableOpacity>
                                            }
                                        </View>
                                        
                                        {/* Editing Tutor For condition block */}
                                        {addFor 
                                        ? // if is editing, show text input for adding
                                        <View>
                                            <View
                                            style={{
                                                borderBottomColor: 'grey',
                                                borderBottomWidth: 1,
                                                margin: "2%",
                                                width: "95%",
                                                alignSelf: "center",
                                            }}
                                            />

                                            <View style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                flexWrap: 'wrap',
                                            }}>
                                                {/* <TextInput 
                                                    style={styles.textInput}
                                                    onChangeText={(text) => setStage(text)}
                                                    // value={stage}
                                                    placeholder='Stage ...'
                                                /> */}

                                                {stages.map((stage, index) => {
                                                    if (!tutorFor.includes(stage)) {
                                                        return (
                                                            <View style={styles.editDetails} key={index}>
                                                                <Text style={styles.infoText}>{stage}</Text>
                                                                <TouchableOpacity style={styles.dellContainer}
                                                                    onPress={() => {
                                                                        console.log("add", index);
                                                                        newValue = tutorFor.slice(0);
                                                                        newValue.push(stage);
                                                                        // console.log(newValue);
                                                                        setTutorFor(newValue);
                                                                    }}
                                                                >
                                                                    <Image source={add} style={styles.dell} />
                                                                </TouchableOpacity>
                                                            </View>
                                                        )
                                                    }
                                                })}

                                                <TouchableOpacity style={styles.addContainer}
                                                    onPress={() => {
                                                        setAddFor(false)
                                                    }}
                                                >
                                                    <Image source={dell} style={styles.add} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        :
                                        null
                                        }

                                        <Text style={styles.infoText}>Language:</Text>
                                        <View style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            flexWrap: 'wrap',
                                        }}>
                                            {languages?.map((stage, index) => (
                                                <View style={styles.editDetails} key={index}>
                                                    <Text style={styles.infoText}>{stage}</Text>
                                                    <TouchableOpacity style={styles.dellContainer}
                                                        onPress={() => {
                                                            console.log("deleting", index);
                                                            newValue = languages.slice(0);
                                                            newValue.splice(index, 1);
                                                            setLanguages(newValue);
                                                        }}
                                                    >
                                                        <Image source={dell} style={styles.dell} />
                                                    </TouchableOpacity>
                                                </View>
                                            ))}
                                            {addLanguage
                                            ? null
                                            :
                                            <TouchableOpacity style={styles.addContainer}
                                                onPress={() => {
                                                    setAddLanguage(true)
                                                }}
                                            >
                                                <Image source={add} style={styles.add} />
                                            </TouchableOpacity>
                                            }
                                        </View>

                                        {addLanguage 
                                        ?
                                        <View style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                        }}>
                                            <TextInput 
                                                style={styles.textInput}
                                                onChangeText={(text) => setLanguage(text)}
                                                // value={stage}
                                                placeholder='English...'
                                            />

                                            <TouchableOpacity style={styles.addContainer}
                                                onPress={() => {
                                                    if (language !== "" && !languages.includes(language)) {
                                                        languages.push(language);
                                                        setAddLanguage(false)
                                                    }
                                                }}
                                            >
                                                <Image source={add} style={styles.add} />
                                            </TouchableOpacity>
                                        </View>
                                        :
                                        null
                                        }
                                        
                                    </View>

                                    <View style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between"
                                    }}>

                                        <TouchableOpacity style={styles.applyBtn}
                                            onPress={() => {
                                                updateBio();
                                                setIsEditingBio(false)
                                            }}
                                        >
                                            <Text style={styles.applyText}>Apply Changes</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.applyBtn, {
                                            backgroundColor: "#E5E9EC",
                                        }]}
                                            onPress={() => {
                                                setQualification(data.Qualification);
                                                setTutorFor(data.TutorFor);
                                                setLanguages(data.Languages);
                                                setIsEditingBio(false);
                                            }}
                                        >
                                            <Text style={[styles.applyText, { color: 'black'}]}>Cancel</Text>
                                        </TouchableOpacity>

                                    </View>
                                </View>
                                
                            </View>

                        :

                            // {/* Header and edit button container */}
                            <View>

                                <View style={styles.heading}>
                                    {/* <Text style={styles.header}>Biography</Text> */}
                                    <TouchableOpacity style={styles.editBtn} onPress={() => setIsEditingBio(true)}>
                                        <Text style={styles.editText}>Edit</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* //  Content container */}
                                <View style={styles.block}>
                                    <Text style={[styles.qualification, {backgroundColor: '#FAFAFA'}]}>{qualification}</Text>
                                    <View style={[styles.infoContainer, {backgroundColor: "#FAFAFA"}]}>
                                        <Text style={styles.infoText}>Tutors for: {tutorFor?.join(", ")}</Text>
                                        <Text style={styles.infoText}>Language: {languages?.join(", ")}</Text>
                                    </View>
                                </View>

                            </View>
                    }
                </View>

                {/* Skills container */}
                <View style={styles.blockContainer}>

                    {
                        isEditingTags

                        ?
                        <View>
                            {/* Header and edit button container */}
                            <View style={styles.heading}>
                                {/* <Text style={styles.header}>Skills</Text> */}
                            </View>

                            {/* Tags container */}
                            <View style={styles.tagsContainer}>
                                {subjects?.map((tag, index) => (
                                    <View style={styles.tag} key={index} >
                                        <Text style={styles.tagText}>{tag}</Text>
                                        <TouchableOpacity style={styles.dellContainer} 
                                            onPress={() => {
                                                console.log("deleting", index);
                                                newValue = subjects.slice(0);
                                                newValue.splice(index, 1);
                                                setSubjects(newValue);
                                            }}
                                        >
                                            <Image source={dell} style={styles.dell} />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                                {addSubject
                                ? 
                                <View style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}>
                                    <TextInput 
                                        style={[styles.textInput, {
                                            padding: 3,
                                            backgroundColor: "#E5E9EC"
                                        }]}
                                        onChangeText={(text) => setSubject(text)}
                                        placeholder='Your skill...'
                                    />

                                    <TouchableOpacity style={styles.addContainer}
                                        onPress={() => {
                                            subjects.push(subject);
                                            setAddSubject(false)
                                        }}
                                    >
                                        <Image source={add} style={styles.add} tintColor="#FF8C39" />
                                    </TouchableOpacity>
                                </View>
                                :
                                <TouchableOpacity style={styles.addContainer} onPress={() => {
                                    setAddSubject(true)
                                }} >
                                    <Image source={add} style={styles.add} />
                                </TouchableOpacity>
                                }

                                <View style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between"
                                }}>

                                    <TouchableOpacity style={styles.applyBtn}
                                        onPress={() => {
                                            updateSubjects();
                                            setIsEditingTags(false)
                                        }}
                                    >
                                        <Text style={styles.applyText}>Apply Changes</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.applyBtn, {
                                        backgroundColor: "#E5E9EC",
                                    }]}
                                        onPress={() => {
                                            setSubjects(data.Subjects);
                                            setIsEditingTags(false)
                                        }}
                                    >
                                        <Text style={[styles.applyText, { color: 'black'}]}>Cancel</Text>
                                    </TouchableOpacity>

                                </View>
                            </View>
                            
                        </View>
                        :
                        <View>
                            {/* Header and edit button container */}
                            <View style={styles.heading}>
                                {/* <Text style={styles.header}>Skills</Text> */}
                                <TouchableOpacity style={styles.editBtn} onPress={() => setIsEditingTags(true)}>
                                    <Text style={styles.editText}>Edit</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Tags container */}
                            <View style={styles.tagsContainer}>
                                {subjects?.map((tag, index) => (
                                    <View style={styles.tag} key={index} >
                                        <Text style={styles.tagText}>{tag}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    }

                    
                </View>

                {/* About container */}
                <View style={styles.blockContainer}>

                    {
                        isEditingIntro

                        ?
                        <View>
                            {/* Header and edit button container */}
                            <View style={styles.heading}>
                                {/* <Text style={styles.header}>Description</Text> */}
                            </View>

                            {/* Intro container */}
                            <View style={styles.block}>
                                <TextInput 
                                    style={[styles.introText, {backgroundColor: '#E5E9EC'}]}
                                    multiline
                                    placeholder='Introduce yourself ...'
                                    onChangeText={(text) => setDescription(text)}
                                    value={description}
                                    autoFocus={true}
                                />

                                <View style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between"
                                }}>

                                    <TouchableOpacity style={styles.applyBtn}
                                        onPress={() => {
                                            updateIntro();
                                            setIsEditingIntro(false)
                                        }}
                                    >
                                        <Text style={styles.applyText}>Apply Changes</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.applyBtn, {
                                        backgroundColor: "#E5E9EC",
                                    }]}
                                        onPress={() => {
                                            setDescription(data.Bio);
                                            setIsEditingIntro(false);
                                        }}
                                    >
                                        <Text style={[styles.applyText, { color: 'black'}]}>Cancel</Text>
                                    </TouchableOpacity>

                                </View>
                            </View>

                        </View>
                        :
                        <View>
                            {/* Header and edit button container */}
                            <View style={styles.heading}>
                                {/* <Text style={styles.header}>Description</Text> */}
                                <TouchableOpacity style={styles.editBtn}>
                                    <Text style={styles.editText} onPress={() => setIsEditingIntro(true)}>Edit</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Intro container */}
                            <View style={styles.block}>
                                <Text style={styles.introText}>{description}</Text>
                            </View>
                        </View>
                    }
                    
                </View>
                
                
            </ScrollView>

        </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = EStyleSheet.create ({
    container: {
        flex: 1,
        backgroundColor: "#FAFAFA"
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

    // PROFILE  
    profileContainer: {
        width: "100%",
        justifyContent: "center", 
        alignItems: "center",
        marginVertical: "5%",
    },
    text: {
        fontSize: "18rem",
        margin: "2.5%",
        fontWeight: "500"
    },
    
    // BLOCKS
    blockContainer: {
        marginHorizontal: "2%",
        marginBottom: "0%",
    },
    heading: { 
        flexDirection: "row", 
        justifyContent: "flex-end",
    },
    header: {
        fontSize: "14rem",
        marginHorizontal: "2%",
        fontWeight: "500",
        width: "100%",
    },
    editBtn: {
        padding: "1%",
    },
    editText: {
        color: "#0A95B4",
        fontWeight: "600",
        fontSize: "14rem",
        marginHorizontal: "2%"
    },
    block: {
        // backgroundColor: "#FFE1BD",
        padding: "2%",
        paddingTop: 0,
        // borderRadius: 10,
        // marginVertical: "1%",
        // borderWidth: 1,
    },
    // BIOGRAPHY
    qualification: {
        fontWeight: "600",
        fontSize: "16rem",
        backgroundColor: "#FFE1BD",
        padding: "3%",
        borderRadius: 7,
        // marginTop: "1%",
    },
    infoContainer: {
        // backgroundColor: "#FFCF96",
        backgroundColor: "#FFE1BD",
        paddingHorizontal: "3%",
        paddingVertical: "1%",
        borderRadius: 7,
        marginTop: "1%",
    },
    infoText: {
        fontSize: "13rem",
        lineHeight: "20rem"
    },
    // SKILLS
    tagsContainer: {
        flexWrap: 'wrap',
        flexDirection: "row",
        justifyContent: "flex-start",
        // backgroundColor: "#FFE1BD",
        padding: "3%",
        borderRadius: 10,
        marginVertical: "2%",
    },
    tag: {
        margin: "1%",
        backgroundColor: "#FF8C39",
        padding: "8rem",
        borderRadius: 6,
        flexDirection: "row",
    },
    tagText: {
        fontSize: "13rem", 
        fontWeight: "600",
        color: "white"
    },
    // DESCRIPTION
    introText: {
        color: "#33363F",
        margin: "1%",
        backgroundColor: "#FFE1BD",
        padding: "5%",
        borderRadius: 7,
        marginTop: "3%",
    },

    // EDIT

    editContent: {
        backgroundColor: "#FFF2E3",
        // flexWrap: "wrap",
        padding: "1%",
        borderRadius: 10,
        fontSize: "16rem",
        textAlign: 'justify',
        paddingHorizontal: "10rem"
    },
    editDetails: {
        marginHorizontal: "1%",
        marginVertical: "0.5%",
        padding: "1%",
        paddingHorizontal: "10rem",
        flexDirection: "row",
        borderRadius: 15,
        borderWidth: 1,
    },
    dell: {
        width: "20rem",
        height: "20rem",
        justifyContent: "center",
        alignItems: "center",
    },
    dellContainer: {
        marginLeft: "8rem",
    },
    add: {
        width: "25rem",
        height: "25rem",
        justifyContent: "center",
        alignItems: "center",
    },
    addContainer: {
        marginLeft: "8rem",
        alignSelf: "center",
    },
    applyBtn: {
        backgroundColor: "#0AAAC0",
        padding: "10rem",
        borderRadius: 20,
        width: "49%",
        marginTop: "2%",
        justifyContent: "center",
        alignItems: "center",
        // borderWidth: 1,
    },
    applyText: {
        color: "white",
        fontWeight: "600",
        fontSize: "16rem"
    },
    textInput: {
        borderRadius: 10,
        backgroundColor: "#FAFAFA",
        margin: "1%",
        marginTop: "2%",
        width: "110rem",
        paddingHorizontal: "10rem",
    }
    
})
