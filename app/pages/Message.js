import { GiftedChat } from 'react-native-gifted-chat';
import React, { useState, Fragment, useLayoutEffect, useCallback } from 'react';

import message from "../data/message";
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import EStyleSheet from "react-native-extended-stylesheet";

import { renderAvatar, renderBubble, renderComposer, renderInputToolbar, renderMessage, renderMessageText, renderSend, renderActions } from '../components/CustomChat'

// Icons
import GoBack from "../assets/icons/Expand_left.svg";

// REM stylesheet
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});

export default function Message ({ route }) {
    const navigation = useNavigation();
    const { name } = route.params;

    useLayoutEffect(() =>{
        navigation.setOptions({
            headerTitle: name,
            headerStyle: styles.headerContainer,
            headerTitleStyle: styles.header,
            headerShadowVisible: false,
            headerLeft: () => (
                <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.goBack()}>
                    <GoBack style={styles.backIcon} />
                </TouchableOpacity>  
            )
        });
    }, [navigation, name]);

    return (
        <Fragment>

            {/* change the background color of the top safe area view align with background */}
            

            <SafeAreaView 
                style={{flex: 1, backgroundColor: "#EAEAEA"}}
                edges={["left", "right", "bottom"]}
            >

                <View style={styles.container}>

                    {/* <View style={styles.headerContainer}>

                        <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.goBack()}>
                            <GoBack style={styles.backIcon} />
                        </TouchableOpacity>

                        <Text style={styles.header}>{name}</Text>
                    </View> */}

                    <GiftedChat
                        messages={messages}
                        text={text}
                        onInputTextChanged={setText} 
                        onSend={messages => onSend(messages)} 
                        showAvatarForEveryMessage={false}
                        showUserAvatar={false}
                        alwaysShowSend={true}
                        bottomOffset={31}
                        messagesContainerStyle={{
                            backgroundColor: '#FAFAFA'
                        }}
                        textInputStyle={{
                            backgroundColor: '#fff',
                            borderRadius: 20,
                        }}
                        user={{
                            _id: "001"
                        }}
                        renderInputToolbar={renderInputToolbar}
                        renderComposer={renderComposer}
                        renderSend={renderSend}
                        renderBubble={renderBubble}
                        renderAvatar={renderAvatar}
                        renderMessageText={renderMessageText}
                        renderActions={renderActions}
                    />
                </View>

            </SafeAreaView>
            
        </Fragment>
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
