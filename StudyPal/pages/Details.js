import React, { startTransition, useLayoutEffect, useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text, StatusBar, Dimensions, ScrollView} from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import EStyleSheet from 'react-native-extended-stylesheet';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import Star from "../assets/icons/Star.svg";

import { MessageTutor } from '../components/MessageTutor';
import { useNavigation } from '@react-navigation/native';

// REM stylesheet
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});

function Details({ route }) {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    // const navigation = useNavigation();

    const { 
        name, 
        bio, 
        rating, 
        gpa, 
        profilePic, 
        qualification, 
        subjects, 
        tutorFor, 
        languages,
        email,
    } = route.params;

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

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View style={styles.container}>

                    {/* Profile */}
                    <View style={styles.profile}>
                        <View style={{ marginRight: "10%", marginLeft: "2%" }}>
                            <Text style = {styles.name}>{name}</Text>

                           {/* Rating */}
                            <View style={styles.rating}>
                                <Text style={styles.profileText}>Rating: {rating}</Text>

                                {Array.apply(null, { length: Math.round(rating) }).map(((rating, index) => (
                                    <View style={styles.starContainer} key={index}>
                                        <Star width={12} height={12} />
                                    </View>
                                )))}
                            </View>
                            <Text style={styles.profileText}>GPA: {gpa}</Text>
                        </View>
                        <Image style = {styles.profilePic} source={{ uri: profilePic }}/>
                    </View>

                    <View style ={styles.body}>
                        <Text style={styles.qualification}>{qualification}</Text>
                        <Text style= {styles.text}>Tutoring for: {tutorFor.join(", ")} students</Text>
                        <Text style= {styles.text}>Languages: {languages.join(", ")}</Text>
                    </View>
                    <View style={styles.buttons}> 
                        {subjects.map(((subject, index) => {
                            return (
                                <View style={styles.btn} key={index}>
                                    <Text style={styles.btnText}>{subject}</Text>
                                </View> 
                            )}
                        ))}
                    </View>

                    <View style={styles.content}>
                        <Text style={styles.qualification}>About</Text>
                        <View style={styles.contentBox}>
                            {
                                bio?.length > 0 ?
                                <Text style= {styles.contentText}>{bio}</Text>
                                :
                                <Text style= {[styles.contentText, {fontStyle: "italic", color: "grey"}]}>This tutor has not written anything yet.</Text>
                            }
                        </View>
                    </View>

                    
                    </View>
                </ScrollView>
                <TouchableOpacity 
                    style={[styles.messageBtn, {bottom: insets.bottom + 8}]}
                    onPress={() => MessageTutor({ navigation: navigation, name: name, email: email })}
                >
                    <Text style={styles.messageText}>Message</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = EStyleSheet.create( {
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: "100%"
      },
    profile: {
        borderColor: "#BCE1E3",
        borderWidth: 2,
        borderRadius: 15,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: "2%",
        padding: "4%",
        width: "350rem",
        marginTop: "3%",
      },
    profileText: {
        fontWeight: "500",
        margin: "1%",
        fontSize: "13rem",
        marginRight: "15%"
    },
    name: {
        fontSize: "24rem", 
        fontWeight: '800', 
        fontFamily:'Roboto',
        // marginHorizontal: "2%",
        marginBottom: "5%",
    },
    rating: {
        flexDirection: 'row', 
        alignItems: 'center',
    },
    starContainer: {
        width: "12rem",
        height: "12rem",
    },
    profilePic: {
        width: "90rem",
        height: "90rem",
        // marginHorizontal: "2%",
        marginRight: "2%"
    },

    body: {
        marginVertical: "4%",
        align: 'center',
        justifyContent: 'center'
    },
    qualification: {
        fontSize: "18rem", 
        fontWeight: "500",
        margin: "1%",
    },
    text: {
        fontSize: "14rem", 
        marginHorizontal: "1%",
    },
    buttons: {
       flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: "5%",
        width: "90%"
    },
    btn: {
        margin: "1%",
        paddingHorizontal: "9rem",
        paddingVertical: "6rem",
        backgroundColor: "#42CAF5",
        borderRadius: 6,
    },
    btnText: {
        fontSize: "13rem",
    },

    btn: {
        backgroundColor: '#42CAF5', 
        alignItems: 'center', 
        borderRadius: 5, 
        justifyContent: 'center',
        margin: "0.5%",
        padding: "8rem",
    },
    content: {
        marginTop: "5%",
        flexWrap: "wrap",
        marginHorizontal: "3.5%",
        width: "90%",
        justifyContent: "center",
        // alignItems: "center",
    },
    contentBox: {
        backgroundColor: "#DBEDF6", 
        borderRadius: 10, 
        marginTop: 10,
        padding: "5%",
        width: "100%",
    },
    contentText: {
        fontSize: "14rem",
    },
    iconContainer: {
        position: "absolute",
        width: "50rem",
        height: "50rem",
        left: "1%",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: "2%"
    },
    backIcon: {
        width: "30rem",
        height: "30rem",
    },
    messageBtn: {
        backgroundColor: 'black',
        alignItems: 'center', 
        justifyContent: 'center', 
        alignSelf: 'center',
        position: 'absolute',
        // bottom: '5%',
        marginBottom: "5%",
        borderRadius: 25, 
        shadowColor: 'black', 
        shadowOpacity: 0.9, 
        elevation: 8,
        width: "85%",
        height: "7%"
    },
    messageText: {
        fontSize: "18rem", 
        color: "white",
        fontWeight: "600" 
    },
});

export default Details;
