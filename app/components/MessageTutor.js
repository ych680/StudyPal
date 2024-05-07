import {
    doc,
    getDoc,
    collection,
    addDoc,
    updateDoc,
    arrayUnion,
} from "firebase/firestore";
import { auth, database } from "../config/firebase";



export async function MessageTutor ({ navigation, name, email }) {

    console.log("Move to message")
    var hasChat = false;
    const userEmail = auth?.currentUser?.email;
    const studentRef = doc(database, "Student", userEmail);

    var avatar = null;
    var chats = [];
    var chatId = null;

    await getDoc(studentRef).then(snapshot => {
        avatar = snapshot.get("ProfilePic");
        chats = snapshot.get("Chats");
    })
    for (let chat in chats) {
        const chatRef = doc(database, "Chats", chats[chat]);
        var users = [];
        await getDoc(chatRef).then((snapshot) => {
            // console.log(snapshot.get("users"));
            users = snapshot.get("users");
        })
        if (users.indexOf(email) !== -1) {
            hasChat = true;
            chatId = chats[chat];
            break;
        }
    }
    
    console.log(hasChat);
    if (hasChat) {
        navigation.navigate("Message", { name: name, chat_id: chatId, to_email: email, isStudent: true, avatar: avatar });
    }
    else {
        const chatRef = await addDoc(collection(database, "Chats"), {
            lastMessage: "",
            users: [email, userEmail],
            time: null
        });
        console.log("chatRef: ", chatRef);
        await updateDoc(doc(database, "Student", userEmail), {
            Chats: arrayUnion(chatRef.id),
        })
        await updateDoc(doc(database, "Tutor", email), {
            Chats: arrayUnion(chatRef.id),
        })
        console.log("Added new chat");
        navigation.navigate("Message", { name: name, chat_id: chatRef.id, to_email: email, isStudent: true, avatar: avatar });
    }
}