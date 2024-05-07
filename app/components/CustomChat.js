import React, {useState} from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
// deleted 'Image' as duplicate import to resolve merge conflict from Filter to alpha
// deleted 'View' as import never used
import { InputToolbar, Actions, Composer, Send, Bubble, Avatar, Message, MessageText } from 'react-native-gifted-chat';
// Commented the below line to resolve merge conflicts
// import { InputToolbar, Actions, Composer, Send, Bubble, Avatar, Message, MessageText } from 'react-native-gifted-chat';

import SendIcon from "../assets/icons/Send.svg";
const file = require("../assets/icons/File.png");
const img = require("../assets/icons/Image.png");

import * as ImagePicker from 'expo-image-picker';

export const renderInputToolbar = (props) => (
  <InputToolbar
    {...props}
    containerStyle={{
        // position: "relative",
        // flexDirection: "column-reverse",
        // backgroundColor: '#EAEAEA',
        // paddingTop: "0.8%",
        // marginBottom: 0,
        // borderTopWidth: 1,
        // // borderTopColor: "#d1d1d1"
        // borderTopColor: "#EAEAEA",
        backgroundColor: "#EAEAEA",
        alignContent: "center",
        justifyContent: "center",
        borderWidth: 0,
        paddingTop: 9,
        marginHorizontal: 6,
        // borderRadius: 32,
        borderTopColor: "transparent",
        width: "100%",
        marginLeft: 0,
    }}
    primaryStyle={{ alignItems: 'center' }}
  />
);

export const renderActions = (props) => {
  // const [selectedImage, setSelectedImage] = useState(null);

  // const pickImage = async () => {
  //     // No permissions request is necessary for launching the image library
  //     let result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.All,
  //       allowsEditing: true,
  //       aspect: [3, 3],
  //       quality: 1,
  //     });
  //     // console.log(result);
  //     if (!result.canceled) {
  //         setSelectedImage(result.assets[0].uri);
  //     }
  // }

  return (
  <Actions
    {...props}
    containerStyle={{
      width: 28,
      height: 26,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: "2.5%",
      marginRight: "1%",
      marginBottom: "1%",
    }}
    icon={() => (
      <Image
        source={img}
        style={{ width: 28, height: 26 }}
        tintColor="#E59333"
      />
    )}
    options={{
      'Choose From Library': () => {
        console.log('Choose From Library');
        pickImage();
      },
      Cancel: () => {
        console.log('Cancel');
      },
    }}
    optionTintColor="#222B45"
  />
)};

export const renderComposer = (props) => (
  <Composer
    {...props}
    textInputStyle={{
      color: '#222B45',
      backgroundColor: '#fff',
      borderRadius: 15,
      paddingTop: "2%",
      marginHorizontal: "3%",
      paddingLeft: "3%",
      bottom: "1%",
      lineHeight: 20,
      height: "90%",
    }}
  />
);

export const renderSend = (props) => (
  <View>
    {/* <TouchableOpacity>
      <Image
          source={img}
          style={{ width: 28, height: 26 }}
          tintColor="#E59333"
        />
    </TouchableOpacity> */}
    <Send
      {...props}
      disabled={!props.text}
      containerStyle={{
      //   width: 70,
      //   height: 35,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: "1%",
        // marginBottom: "1%",
      //   backgroundColor: 'darkblue',
        color: 'black',
      //   bottom: 3,
      }}
    >
      <SendIcon style={{
              width: 26,
              height: 26,
              tintColor: "#6e6e6e",
              marginRight: 12,
          }}
          fill="#FFA439"
      />

    </Send>
  </View>
);

export const renderSendTutor = (props) => (
  <Send
    {...props}
    disabled={!props.text}
    containerStyle={{
    //   width: 70,
    //   height: 35,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: "1%",
      // marginBottom: "1%",
    //   backgroundColor: 'darkblue',
      color: 'black',
    //   bottom: 3,
    }}
  >
    <SendIcon style={{
            width: 26,
            height: 26,
            tintColor: "#26A1B1",
            marginRight: 12,
        }}
        fill="#26A1B1"
    />

  </Send>
);

export const renderBubble = (props) => {
    return (
        <Bubble
            {...props}
            wrapperStyle={{
                left: { 
                    padding: "1%",
                    paddingTop: "1.5%",
                    paddingBottom: "-1%",
                    backgroundColor: "#E8E8E8",
                    marginBottom: "0.5%",
                },
                right: {
                    padding: "1%",
                    paddingTop: "1.5%",
                    paddingBottom: "-1%",
                    backgroundColor: "#2698B1",
                    marginBottom: "0.5%",
                },
            }} 
            containerStyle={{
                right: { borderTopRightRadius: 15, borderBottomRightRadius: 15 },
                left: { borderTopLeftRadius: 15, borderBottomLeftRadius: 15 },
            }}
            containerToPreviousStyle={{
                right: { borderTopRightRadius: 15 },
                left: { borderTopLeftRadius: 15 },
              }}
              containerToNextStyle={{
                right: { borderTopRightRadius: 15, borderBottomRightRadius: 15 },
                left: { borderTopLeftRadius: 15, borderBottomLeftRadius: 15 },
              }}
              bottomContainerStyle={{
                right: {
                    bottom: 2
                },
                left: {
                    bottom: 2
                }
              }}
        />
    )
}

export const renderBubbleTutor = (props) => {
  return (
      <Bubble
          {...props}
          wrapperStyle={{
              left: { 
                  padding: "1%",
                  paddingTop: "1.5%",
                  paddingBottom: "-1%",
                  backgroundColor: "#E8E8E8",
                  marginBottom: "0.5%",
              },
              right: {
                  padding: "1%",
                  paddingTop: "1.5%",
                  paddingBottom: "-1%",
                  backgroundColor: "#E97827",
                  marginBottom: "0.5%",
              },
          }} 
          containerStyle={{
              right: { borderTopRightRadius: 15, borderBottomRightRadius: 15 },
              left: { borderTopLeftRadius: 15, borderBottomLeftRadius: 15 },
          }}
          containerToPreviousStyle={{
              right: { borderTopRightRadius: 15 },
              left: { borderTopLeftRadius: 15 },
            }}
            containerToNextStyle={{
              right: { borderTopRightRadius: 15, borderBottomRightRadius: 15 },
              left: { borderTopLeftRadius: 15, borderBottomLeftRadius: 15 },
            }}
            bottomContainerStyle={{
              right: {
                  bottom: 2
              },
              left: {
                  bottom: 2
              }
            }}
      />
  )
}

export const renderAvatar = (props) => (
    <Avatar
      {...props}
      containerStyle={{ 
        left: { 
            marginRight: -3
        }, 
        right: {

        } }}
      imageStyle={{ 
        left: { 
            // borderWidth: 3, 
            // borderColor: 'blue',
            height: 55,
            width: 55,
            borderRadius: 100,
        }, 
        right: {
            height: 55,
            width: 55,
            borderRadius: 100,
        } }}
    />
  );

  export const renderMessage = (props) => (
    <Message
      {...props}
      // renderDay={() => <Text>Date</Text>}
      containerStyle={{
        left: {  },
        right: { },
      }}
    />
  );

  export const renderMessageText = (props) => (
    <MessageText
      {...props}
    //   containerStyle={{
    //     left: { backgroundColor: 'yellow' },
    //     right: { backgroundColor: 'purple' },
    //   }}
      textStyle={{
        left: {  },
        right: {  },
      }}
      linkStyle={{
        left: {  },
        right: {  },
      }}
      customTextStyle={{ fontSize: 16, lineHeight: 22 }}
    />
  );
