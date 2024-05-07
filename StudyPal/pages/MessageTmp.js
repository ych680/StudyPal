import React, { useState, useLayoutEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
    updateDoc
} from "firebase/firestore";
import { auth, database } from "../config/firebase";


// Importing assets and data
import { AntDesign } from '@expo/vector-icons'; 
import GoBack from "../assets/icons/Expand_left.svg";
import messageData from "../data/message";



export default function Message({ route, navigation }) {
    const { name, chat_id, to_email, isStudent, avatar } = route.params;
    const userEmail = auth?.currentUser?.email;

    const insets = useSafeAreaInsets();
    bottomOffset = insets.bottom;

    useLayoutEffect(() => {
        navigation.setOptions({
            title: name,
            headerLeft: () => (
                <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.goBack()}>
                    <AntDesign name="left" size={24} color="black" style={styles.backIcon} />
                </TouchableOpacity>
            )
        });
    }, [navigation, name]);

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
        setDoc(doc(database, "Chats", chat_id), {
            lastMessage: text,
            time: createdAt,
            users: [to_email, auth?.currentUser?.email]
        });

        var chatRef = null;
        if (isStudent) {
            chatRef = doc(database, "Student", userEmail);
        } else {
            chatRef = doc(database, "Tutor", userEmail);
        }
        getDoc(chatRef)
        .then((snapshot) => {
            var chatIds = snapshot.get("Chats");
            console.log(chatIds);
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
    }, []);

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
    },
    backIcon: {
        width: "30rem",
        height: "30rem",
    }
})