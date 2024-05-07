import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import EStyleSheet from "react-native-extended-stylesheet";

import { GiftedChat } from 'react-native-gifted-chat';
import { renderAvatar, renderBubble, renderBubbleTutor, renderComposer, renderInputToolbar, renderMessage, renderMessageText, renderSend, renderSendTutor, renderActions } from '../components/CustomChat'

import { 
    collection, 
    addDoc, 
    orderBy, 
    query, 
    onSnapshot,
    doc,
    Timestamp,
    setDoc,
    getDoc,
    updateDoc,
    FieldValue,
    increment,
    deleteDoc
} from "firebase/firestore";
import { auth, database } from "../config/firebase";


// Importing assets and data
import { AntDesign } from '@expo/vector-icons'; 
import GoBack from "../assets/icons/Expand_left.svg";
import messageData from "../data/message";
import tutor from '../data/tutor';
const online = require("../assets/icons/online.png")
const invisible = require("../assets/icons/invisible.png")
const disturb = require("../assets/icons/disturb.png")


export default function Message({ route, navigation }) {
    const { name, chat_id, to_email, isStudent, avatar } = route.params;
    const userEmail = auth?.currentUser?.email;

    const insets = useSafeAreaInsets();
    bottomOffset = insets.bottom;

    const [status, setStatus] = useState(undefined);

    useLayoutEffect(() => {
        if (isStudent) {
            getDoc(doc(database, "Tutor", to_email))
            .then(snapshot => {
                setStatus(snapshot.get("Status"));
            })
        } else {
            getDoc(doc(database, "Student", to_email))
            .then(snapshot => {
                setStatus(snapshot.get("Status"));
            })
        }
    },[]);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: name,
            headerLeft: () => (
                <TouchableOpacity style={styles.iconContainer} onPress={HandleBack}>
                    <AntDesign name="left" size={24} color="black" style={styles.backIcon} />
                </TouchableOpacity>
            ),
            headerRight: () => (
                status === "Online"
                    ? <Image source={online} style={styles.status} /> 
                    : status === "Invisible"
                        ? <Image source={invisible} style={styles.status} />
                        : status === "Do Not Disturb" 
                            ? <Image source={disturb} style={styles.status} />
                            : null
            )
        });
    }, [navigation, name, status]);

    const [text, setText] = useState('');
    const [messages, setMessages] = useState([]);

    useLayoutEffect(() => {
        const messageRef = collection(database, "Messages/messages/"+chat_id);
        const q = query(messageRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, snapshot => {
            console.log("Message snapshot");
            setMessages(
                snapshot.docs.map(doc => ({
                    _id: doc.data()._id,
                    createdAt: doc.data().createdAt.toDate(),
                    text: doc.data().text,
                    user: doc.data().user
                }))
            );
            updateDoc(doc(database, "Chats", chat_id), {
                [`${userEmail}`]: 0,
            });
            
        });
        return unsubscribe;
    }, [])

    const onSend = useCallback((newMessages = []) => {
        setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
        const {_id, createdAt, text, user } = newMessages[0];
        addDoc(collection(database, "Messages/messages/"+chat_id), {
            _id, createdAt, text, user
        });

        console.log("Update chat")
        updateDoc(doc(database, "Chats", chat_id), {
            lastMessage: text,
            time: createdAt,
            [`${to_email}`]: increment(1),
        });

        var chatRef = null;
        var chatRef2 = null;
        if (isStudent) {
            chatRef = doc(database, "Student", userEmail);
            chatRef2 = doc(database, "Tutor", to_email);
        } else {
            chatRef = doc(database, "Tutor", userEmail);
            chatRef2 = doc(database, "Student", to_email);
        }
        getDoc(chatRef)
        .then((snapshot) => {
            var chatIds = snapshot.get("Chats");
            // console.log(chatIds);
            chatIds.splice(chatIds.indexOf(chat_id), 1);
            chatIds.unshift(chat_id);
            updateDoc(chatRef, {
                Chats: chatIds,
            })
            .catch((error) => {
                console.log("Error setting chat ids in onSend: ", error);
            });
        })
        .catch((error) => {
            console.log("Error getting documents in onSend: ", error);
        });
        getDoc(chatRef2)
        .then((snapshot) => {
            var chatIds = snapshot.get("Chats");
            // console.log(chatIds);
            chatIds.splice(chatIds.indexOf(chat_id), 1);
            chatIds.unshift(chat_id);
            updateDoc(chatRef2, {
                Chats: chatIds,
            })
            .catch((error) => {
                console.log("Error setting chat ids in onSend: ", error);
            });
        })
        .catch((error) => {
            console.log("Error getting documents in onSend: ", error);
        });
    }, []);

    const HandleBack = () => {
        navigation.goBack()
        getDoc(doc(database, "Chats", chat_id))
        .then(snapshot => {
            if (snapshot.get("time") === null) {
                console.log("Delete chat", chat_id);
                // deleteDoc(doc(database, "Chats", chat_id));
                if (isStudent) {
                    const studentRef = doc(database, "Student", userEmail)
                    const tutorRef = doc(database, "Tutor", to_email)
                    getDoc(studentRef)
                    .then(doc => {
                        let i = doc.get("Chats").indexOf(chat_id);
                        let newChats = doc.get("Chats");
                        newChats.splice(i, 1);
                        // console.log(newChats);
                        updateDoc(studentRef, {
                            Chats: newChats,
                        })
                    })
                    getDoc(tutorRef)
                    .then(doc => {
                        let i = doc.get("Chats").indexOf(chat_id);
                        let newChats = doc.get("Chats");
                        newChats.splice(i, 1);
                        // console.log(newChats);
                        updateDoc(tutorRef, {
                            Chats: newChats,
                        })
                    })
                } else {
                    const studentRef = doc(database, "Student", to_email)
                    const tutorRef = doc(database, "Tutor", userEmail)
                    getDoc(studentRef)
                    .then(doc => {
                        let i = doc.get("Chats").indexOf(chat_id);
                        let newChats = doc.get("Chats");
                        newChats.splice(i, 1);
                        // console.log(newChats);
                        updateDoc(studentRef, {
                            Chats: newChats,
                        })
                    })
                    getDoc(tutorRef)
                    .then(doc => {
                        let i = doc.get("Chats").indexOf(chat_id);
                        let newChats = doc.get("Chats");
                        newChats.splice(i, 1);
                        // console.log(newChats);
                        updateDoc(tutorRef, {
                            Chats: newChats,
                        })
                    })
                }
            }
        })
    }

    return (
        <SafeAreaView 
                style={{flex: 1, backgroundColor: "#EAEAEA"}}
                edges={["left", "right", "bottom"]}
        >
            <View style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
                <GiftedChat
                    messages={messages}
                    text={text}
                    onInputTextChanged={setText} 
                    onSend={onSend} 
                    showAvatarForEveryMessage={true}
                    showUserAvatar={true}
                    alwaysShowSend={true}
                    bottomOffset={bottomOffset}
                    messagesContainerStyle={{
                        backgroundColor: '#FAFAFA'
                    }}
                    textInputStyle={{
                        backgroundColor: '#fff',
                        borderRadius: 20,
                    }}
                    user={{
                        _id: auth?.currentUser?.email,
                        avatar: avatar,
                    }}
                    renderInputToolbar={renderInputToolbar}
                    renderComposer={renderComposer}
                    renderSend={isStudent ? renderSend : renderSendTutor}
                    renderBubble={isStudent ? renderBubble : renderBubbleTutor}
                    renderAvatar={renderAvatar} 
                    renderMessageText={renderMessageText}
                    // renderActions={renderActions}
                />
                {/* <KeyboardSpacer /> */}
            </View>
        </SafeAreaView>
    );
}

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FAFAFA",
    },
    headerContainer: {
        width: "100%",
        height: "20%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FAFAFA"
    },
    header: {
        fontSize: "20rem",
        fontWeight: "400",
    },
    iconContainer: {
        position: "absolute",
        width: "50rem",
        height: "50rem",
        left: "1%",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },
    backIcon: {
        width: "30rem",
        height: "30rem",
    },
    status: {
        width: "10rem",
        height: "10rem",
    }
})