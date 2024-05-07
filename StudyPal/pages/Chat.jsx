
import React, {Fragment, useEffect, useLayoutEffect, useState} from "react";
import { RefreshControl, Alert, View, Text, ScrollView, TextInput, Image, TouchableOpacity, Dimensions, ActivityIndicator, FlatList } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import EStyleSheet from "react-native-extended-stylesheet";

import tutor from "../data/tutor";

import {
    onSnapshot,
    doc,
    Timestamp,
    getDoc,
} from "firebase/firestore";
import { auth, database } from "../config/firebase";

// Icons
const search = require("../assets/icons/Search.png");


// REM stylesheet
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});

var color = null;

export default function Chat({ route }) {
    // console.log("Loading chat...")

    const navigation = useNavigation();

    const isStudent = route.params.isStudent;

    useLayoutEffect(() => {
        if (isStudent) {
            color = "#B4E8FF";
        } else {
            color = "#FFD0AE";
        }
    }, [])
    

    useLayoutEffect(() =>{
        navigation.setOptions({
            header: () => (
                <Fragment>
                    <SafeAreaView edges={['top']} style={{backgroundColor: "#FAFAFA"}} />
                    <View style={styles.titleContainer}>
                        <Text style={styles.titleText}>Message</Text>    
                    </View>
                </Fragment>
            ),
        });
    }, [navigation]);

    // tutors data
    // const tutors = tutor;

    const [isLoading, setIsLoading] = useState(true);
    const [chatsIds, setChatsIds] = useState([]);
    const [chats, setChats] = useState([]);
    // const [isStudent, setIsStudent] = useState(null);
    const [avatar, setAvatar] = useState("");

    const userEmail = auth.currentUser?.email;

    // useEffect(() => {
        
    //     if(userEmail) {
    //         // var userRef = doc(database, "Users", userEmail);
    //         // getDoc(userRef)
    //         // .then(snapshot => 
    //         //         setIsStudent(snapshot.get("student"))
    //         //     )
    //         // .then(() => setChats([]))
    //         // .catch((error) => console.log("Error in retreiving user and chat ids:", error));
    //         setChats([]);
    //         }
    // }, []);

    useEffect(() => {
        // console.log("isStudent", isStudent);
        console.log("Loading chat ids...")
        if (isStudent) {
            const roleRef = doc(database, "Student", userEmail);
            // console.log("role", roleRef);
            getDoc(roleRef)
            .then(snapshot => {
                setIsLoading(true);
                console.log("User snapshot");
                setChatsIds(snapshot.get("Chats"))
                setAvatar(snapshot.get("ProfilePic"));
            })
        } else if (isStudent === false) {
            const roleRef = doc(database, "Tutor", userEmail);
            // console.log("role", roleRef);
            getDoc(roleRef)
            .then(snapshot => {
                setIsLoading(true);
                console.log("User snapshot");
                setChatsIds(snapshot.get("Chats"));
                setAvatar(snapshot.get("ProfilePic"));
                // console.log("avatar", snapshot.get("ProfilePic"));
            })
        }
    }, [isStudent])

    useLayoutEffect(() => {
        console.log("Loading chats...")
        var currentChats = [];
        try {
        if (chatsIds.length > 0) {
            if (chatsIds.length > currentChats.length) {
                // console.log("Chat ids", chatsIds)
                const arr = chatsIds.slice().reverse();
                // console.log("arr", arr);
                arr.forEach(chatId => {
                    var chatRef = doc(database, "Chats", chatId);
                    const unsub = onSnapshot(chatRef, snapshot => {
                        setIsLoading(true);
                        console.log("Chat snapshot");
                        // console.log("Current:", currentChats);
                        currentChats = currentChats.filter(chat => {
                            // console.log("filter");
                            return chat._id !== chatId
                        });
                        // console.log("New:", currentChats);
                        // console.log(`check ${chatId}`, snapshot.data());
    
                        const emails = snapshot.get("users");
                        // console.log(emails);
                        var to_email = ""
                        emails.forEach(email => {
                            if (email != userEmail) {
                                to_email = email;
                            }
                        })
                        // console.log(to_email);
    
                        // Get chat details
                        var nameRef = null;
                        if (isStudent) {
                            nameRef = doc(database, "Tutor", to_email);
                        } else {
                            nameRef = doc(database, "Student", to_email);
                        }
                        var name = '';
                        var profile_pic = '';
                        getDoc(nameRef)
                        .then(snapshot2 => {
                            // console.log(snapshot2.data())
                            name = snapshot2.get("Fname") + " " + snapshot2.get("Lname");
                            // console.log("Name:", name);
    
                            // Get chat time
                            var timeString = "";
                            if (snapshot.data().time) {
                                const timestamp = new Timestamp(snapshot.data().time.seconds, snapshot.data().time.nanoseconds);
                                const date = timestamp.toDate();
                                const today = new Date();
                                
                                if (date.toDateString() === today.toDateString()) {
                                    timeString = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit"});
                                } else if (date.getFullYear() === today.getFullYear()) {
                                    timeString = date.toLocaleDateString([], {day: "2-digit", month: "2-digit"});
                                } else {
                                    date.toLocaleDateString([], {day: "2-digit", month: "2-digit", year: "numeric"});
                                }
                            }
                            

                            // Get avatar image URL
                            var profile_pic = snapshot2.get("ProfilePic");
                            // console.log("Profile pic:", profile_pic);
    
                            // Create chat
                            const chat = {
                                _id: snapshot.id,
                                name: name,
                                lastMessage: snapshot.get("lastMessage"),
                                time: timeString,
                                to_email: to_email,
                                profile_pic: profile_pic,
                            }
                            //console.log("This chat:", chat)
    
                            currentChats.unshift(chat);
                            // console.log(chat.name, currentChats, chatsIds);

                            setChats(currentChats);
                            const currentIds = currentChats.map(c => c._id);
                            if (chatsIds.length == currentChats.length) {
                                setIsLoading(false);
                                console.log("Set loading false");
                            } else {
                                setIsLoading(true);
                            }
                        })
                        .catch((error) => console.log("Error in retreiving chat details:", error));
                    }); 
                    return unsub;
                });
            } 

        } else {
            setIsLoading(false);
        }
        } catch (error) {
            console.log("Error in retreiving chats:", error);
        }
    }, [chatsIds]);

    const [refreshing, setRefreshing] = useState(false);

    const refreshSimulationHandler = () => {
        //setChats([]);
        setRefreshing(true);
        setTimeout(async () => {
          //loadChats();
          setRefreshing(false);
        }, 1500);
    };

    const renderChat = ({ chat }) => {
        // console.log(chat);
        return (
            <TouchableOpacity 
                style={[styles.tabContainer, {
                    backgroundColor: color,
                }]} 
                key={chat._id}
                onPress={() => navigation.navigate("Message", { 
                    name: chat.name, 
                    chat_id: chat._id, 
                    to_email: chat.to_email,
                    isStudent: isStudent,
                    avatar: avatar,
                })}
            >

                {/* Image container */}
                <View style={styles.avatarContainer}>
                    <Image 
                        source={{ uri: chat.profile_pic }}
                        resizeMode="contain"
                        style={{width: "100%", height: "100%"}}
                    />
                </View>

                {/* Chat details */}
                <View style={styles.chatDetails}>
                    <Text style={styles.chatName} >{chat.name}</Text>
                    <View style={styles.infoContainer}>
                        <Text style={styles.message}>{chat.lastMessage}</Text>
                        <Text style={styles.time}>{chat.time}</Text>
                    </View>
                    
                </View>
                
            </TouchableOpacity>
        );
    }
    

    if (isLoading) {
        return (
            <View style={{height: "100%", width: "100%", backgroundColor: "#FAFAFA", justifyContent: "center"}}>
                <ActivityIndicator size="large" color="orange" />
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container} edges={['right', 'left', 'bottom']}>
            
            <ScrollView
                refreshControl={
                    <RefreshControl 
                        refreshing={refreshing}
                        onRefresh={() => refreshSimulationHandler()}
                    />
                }
            >
                
                {/* Search bar */}
                <View style={styles.searchBar}>
                    <View style={styles.searchContainer}>  
                        <Image source={search} style={styles.searchIcon} />
                        <TextInput 
                            style={styles.searchText}
                            placeholder="Search people"
                            placeholderTextColor="#7A7F8E"
                        />
                    </View>
                </View>

                {/* Chat tabs */}
                <View>

                    {/* Each block */}

                    
                    {/* {chatsIds.length === chats.length && 
                        <FlatList 
                            data={chats}
                            renderItem={renderChat}
                            keyExtractor={(item) => item._id}
                            showsVerticalScrollIndicator={false}
                        />
                    } */}

                    {/* {console.log("Final:", chats)}
                    {console.log("avatar", avatar)} */}
                    {chats?.map((chat) => (
                        renderChat({ chat })
                    ))}

                    

                </View>
                
            </ScrollView>
            
        </SafeAreaView>
    )

}

const styles = EStyleSheet.create({
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

    // SEARCH  
    searchContainer: {
        flexDirection: "row"
    },
    searchBar: {
        backgroundColor: "#edeff0",
        margin: "3%",
        height: "30rem",
        justifyContent: "center",
        borderRadius: 10,

    },

    searchText: {
        marginHorizontal: "3%",
        fontSize: "16rem",
        fontWeight: "300",
        opacity: 10,
        width: "90%"
    },
    searchIcon: {
        height: "25rem",
        width: "25rem",
        marginLeft: "4%",
    },

    // CHAT
    tabContainer: {
        flex: 1,
        flexDirection: 'row',
        padding: "2%",
        marginHorizontal: "1%",
        marginBottom: "0.5%",
        backgroundColor: color,
        borderRadius: 10,
        fontWeight: "bold"
    },
    avatarContainer: {
        marginHorizontal: "2.5%",
        width: "55rem",
        height: "55rem",
        borderRadius: 100,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",   
        overflow: "hidden"
    },
    // CHAT DETAILS
    chatDetails: {
        marginVertical: "2%",
        marginHorizontal: "1%",
        width: "78%",
    },
    chatName: {
        fontWeight: "400", 
        fontSize: "16rem"
    },
    infoContainer: {
        flexDirection: "row", 
        marginTop: "3%", 
        justifyContent: "space-between", 
        width: "100%"
    },
    message: {
        fontSize: "13rem",
        fontWeight: "300",
        width: "78%"
    },
    time: {
        fontSize: "12rem",
        fontWeight: "200",
        
    },

    // NAVBAR
    navbar: {
        backgroundColor: "#E0E0E0",
        width: "100%",
        height: "80rem",
        position: "absolute",
        bottom: 0,
        justifyContent: "center",
        alignItems: "center"
    },
    navbarBtn: {
        width: "50rem",
        height: "50rem",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: "8%"
    },
    icon: {
        width: "35rem",
        height: "35rem",
    },
    navbarText: {
        fontSize: "11rem",
        color: "#2E4851"
    },
    selectedText:{
        fontSize: "11rem",
        color: "#E59333"
    },
    btnContainter: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginBottom: "2%"
    },
  });