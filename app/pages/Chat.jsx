
import React, {Fragment, useEffect, useLayoutEffect, useState} from "react";
import { RefreshControl, Alert, View, Text, ScrollView, TextInput, Image, TouchableOpacity, Dimensions, ActivityIndicator, FlatList } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import EStyleSheet from "react-native-extended-stylesheet";

import {
    onSnapshot,
    doc,
    Timestamp,
    getDoc,
} from "firebase/firestore";
import { auth, database } from "../config/firebase";

// Icons
const search = require("../assets/icons/Search.png");
const dell = require("../assets/icons/Dell.png");

// REM stylesheet
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});

var color = null;

export default function Chat({ route }) {

    const navigation = useNavigation();

    const isStudent = route.params.isStudent;

    const [searchTerm, setSearchTerm] = useState("");

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

    const [isLoading, setIsLoading] = useState(true);
    const [chatsIds, setChatsIds] = useState([]);
    const [chats, setChats] = useState([]);
    const [avatar, setAvatar] = useState("");
    const [unreadMessages, setUnreadMessages] = useState(0);

    const userEmail = auth.currentUser?.email;

    // Get the chat ids the user is subscribed to
    useEffect(() => {
        console.log("Loading chat ids...")
        if (isStudent) {
            const roleRef = doc(database, "Student", userEmail);
            onSnapshot(roleRef, snapshot => {
                setIsLoading(true);
                console.log("User snapshot");
                setChatsIds(snapshot.get("Chats").slice(0));
                setAvatar(snapshot.get("ProfilePic"));
            })
        } else if (isStudent === false) {
            const roleRef = doc(database, "Tutor", userEmail);
            onSnapshot(roleRef, snapshot => {
                setIsLoading(true);
                console.log("User snapshot");
                setChatsIds(snapshot.get("Chats").slice(0));
                setAvatar(snapshot.get("ProfilePic"));
            })
        }
    }, [isStudent])

    // Get all chat details
    useLayoutEffect(() => {
        console.log("Loading chats...")
        var currentChats = [];
        try {
        if (chatsIds.length > 0) {
            if (chatsIds.length > currentChats.length) {
                const arr = chatsIds.slice().reverse();
                arr.forEach(chatId => {
                    var chatRef = doc(database, "Chats", chatId);
                    const unsub = onSnapshot(chatRef, snapshot => {
                        setIsLoading(true);
                        console.log("Chat snapshot");
                
                        // Get opponent email
                        const emails = snapshot.get("users");
                        var to_email = "";
                        emails.forEach(email => {
                            if (email != userEmail) {
                                to_email = email;
                            }
                        })
    
                        // Get chat details
                        var nameRef = null;
                        if (isStudent) {
                            nameRef = doc(database, "Tutor", to_email);
                        } else {
                            nameRef = doc(database, "Student", to_email);
                        }
                        var name = '';
                        var status = '';
                        var subjects= [];
                        onSnapshot(nameRef, snapshot2 => {
                            name = snapshot2.get("Fname") + " " + snapshot2.get("Lname");
                            status = snapshot2.get("Status");

                            if (isStudent) {
                                subjects = snapshot2.get("Subjects");
                            }
    
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
    
                            // Create chat
                            const chat = {
                                _id: snapshot.id,
                                name: name,
                                lastMessage: snapshot.get("lastMessage"),
                                time: timeString,
                                to_email: to_email,
                                profile_pic: profile_pic,
                                unreadMessages: snapshot.get(userEmail),
                                status: status,
                                subjects: subjects,
                            }
    
                            // If chat already exists, replace it with new chat details
                            let obj = currentChats.find(chat => chat._id === chatId)
                            if (obj) {
                                let i = currentChats.indexOf(obj);
                                currentChats[i] = chat;
                            } else {
                                currentChats.unshift(chat);
                            }

                            setChats(currentChats);
                            if (chatsIds.length == currentChats.length) {
                                setIsLoading(false);
                                console.log("Set loading false");
                            } else {
                                setIsLoading(true);
                            }
                        })
                        // .catch((error) => console.log("Error in retreiving chat details:", error));
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
        setRefreshing(true);
        setTimeout(async () => {
          setRefreshing(false);
        }, 1500);
    };

    const renderChat = ({ chat }) => {
        return (
            <TouchableOpacity 
                style={[styles.tabContainer, {
                    backgroundColor: color,
                    opacity: chat.status === "Online" ? 1 : 0.5,
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

                        <View style={styles.infoContainer}>
                            <Text style={styles.chatName} >{chat.name}</Text>

                            {/* Number of unread messages */}
                            <View>
                                {
                                    chat.unreadMessages > 0 ? // if unread messages is 0, then it will not show
                                    <View style={[styles.unread, {
                                        backgroundColor: color === "#B4E8FF" ? "#0075A7" : "#F4600D",
                                    }]}>
                                        <Text style={{color: "white", fontWeight: "600"}}>{chat.unreadMessages}</Text>
                                    </View>
                                    : null
                                }
                                
                            </View>
                        </View>

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
                            value={searchTerm}
                            onChangeText={text => setSearchTerm(text)}
                        />
                        {
                            searchTerm.length > 0
                            ?
                            <TouchableOpacity 
                                style={styles.dellContainer}
                                onPress={() => setSearchTerm("")}
                            >
                                <Image source={dell} style={styles.dell} />
                            </TouchableOpacity>
                            : null
                        }
                    </View>
                </View>

                {/* Chat tabs */}
                <View>

                    {/* Each block */}

                    {/* {console.log("Final:", chats)}
                    {console.log("avatar", avatar)} */}
                    {
                        searchTerm.length > 0 
                        ?
                        chats.filter((tutor)=> 
                            tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            tutor.subjects.toString().toLowerCase().includes(searchTerm.toLowerCase())
                        )?.map((chat) => (
                            renderChat({ chat })
                        ))
                        :
                        chats?.map((chat) => (
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
        flexDirection: "row",
        backgroundColor: "#edeff0",
        marginHorizontal: "3%",
        marginVertical: "2%",
        height: "35rem",
        borderRadius: 10,
    },
    searchIcon: {
        height: "22rem",
        width: "20rem",
        marginLeft: "3%",
        alignSelf: "center"
    },
    dell: {
        width: "20rem",
        height: "20rem",
        justifyContent: "center",
        alignItems: "center",
    },
    dellContainer: {
        justifyContent: "center",
        alignItems: "center",
        justifySelf: "flex-end"
    },
    searchText: {
        marginHorizontal: "2%",
        fontSize: "14rem",
        fontWeight: "300",
        opacity: 10,
        width: "77%",
        // backgroundColor: "grey"
    },
    searchBar: {
        // flexDirection: "row",
        // justifyContent: "space-between",
        // alignItems: "center",
        // // backgroundColor: "grey"
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
        marginHorizontal: "1%",
        width: "78%",
    },
    chatName: {
        fontWeight: "400", 
        fontSize: "16rem",
        // marginBottom: "2%",
    },
    infoContainer: {
        flexDirection: "row", 
        marginVertical: "1.5%", 
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
    unread: {
        marginRight: "1.5%",
        width: "20rem",
        height: "20rem",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
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