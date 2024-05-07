import React, { startTransition, useEffect, useLayoutEffect, useReducer, useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text, StatusBar, Dimensions, ScrollView} from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import EStyleSheet from 'react-native-extended-stylesheet';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import Star from "../assets/icons/Star.svg";
const star = require("../assets/star.png");

import { MessageTutor } from '../components/MessageTutor';
import { useNavigation } from '@react-navigation/native';
import { database, auth } from '../config/firebase';
import { arrayUnion, doc, getDoc, increment, onSnapshot, updateDoc } from 'firebase/firestore';

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
        location,
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

    const [numOfRating, setNumOfRating] = useState();
    const [currentRating, setCurrentRating] = useState();

    useEffect(()=> {
        onSnapshot(doc(database, "Tutor", email), snapshot => {
            const num = snapshot.get("NumberOfRating");
            if (num === undefined) {
                setNumOfRating(0);
            } else {
                setNumOfRating(num);
            }
            setCurrentRating(snapshot.get("Rating"));
        })
        getDoc(doc(database, "Student", auth.currentUser.email))
        .then(snapshot => {
            const ratings = snapshot.get("Rating");
            try {
                const r = ratings.find(obj => obj._id === email);
                if (r) {
                    console.log(r);
                    setRating(r.rating);
                } else {
                    setRating(0);
                }
            } catch (e) {
                setRating(0);
            }
            
        })
    }, []);

    const [userRating, setRating] = useState(0);

    const handleRating = (index) => {
        // console.log(index);
        if (index === userRating - 1) {
            console.log(numOfRating, currentRating, userRating)
            var newRating;
            if (numOfRating === 1) {
                newRating = 0;
            } else {
                newRating = (numOfRating * currentRating - userRating) / (numOfRating - 1);
            }
            console.log("New rating", newRating);
            setRating(0);
            updateDoc(doc(database, "Tutor", email), {
                NumberOfRating: numOfRating-1,
                Rating: newRating,
            })
        } else if (userRating === 0){
            setRating(index + 1);
            const newRating = (numOfRating * currentRating + index + 1) / (numOfRating + 1);
            console.log("New rating", newRating);
            updateDoc(doc(database, "Tutor", email), {
                NumberOfRating: increment(1),
                Rating: newRating,
            })
        } else {
            console.log(numOfRating, currentRating, userRating)
            var newRating;
            if (numOfRating === 1) {
                newRating = 0;
            } else {
                newRating = (numOfRating * currentRating - userRating) / (numOfRating - 1);
            }
            setRating(index + 1);
            newRating = ((numOfRating-1) * newRating + index + 1) / (numOfRating);
            console.log("New rating", newRating);
            updateDoc(doc(database, "Tutor", email), {
                Rating: newRating,
            })
        }
    }

    useEffect(() => {
        getDoc(doc(database, "Student", auth.currentUser.email))
        .then(snapshot => {
            var ratings = snapshot.get("Rating");
            try {
                const r = ratings.find(obj => obj._id === email);
                if (r) {
                    ratings.find(obj => obj._id === email).rating = userRating;
                    
                } else {
                    ratings.push({
                        _id: email,
                        rating: userRating,
                    })
                }
            } catch (e) {
                ratings = [{
                    _id: email,
                    rating: userRating,
                }]
            }
            
            console.log(ratings, userRating);
            updateDoc(doc(database, "Student", auth.currentUser.email), {
                Rating: ratings,
            })
        })
    }, [userRating])

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.container}>

                    {/* Profile */}
                    <View style={styles.profile}>
                        <View style={{ marginRight: "5%", marginLeft: "2%" }}>
                            <Text style = {styles.name}>{name}</Text>

                           {/* Rating */}
                            <View style={styles.rating}>
                                <Text style={styles.profileText}>Rating: {Math.round(currentRating*100)/100}</Text>

                                {Array.apply(null, { length: Math.round(currentRating) }).map(((rating, index) => (
                                    <View style={styles.starContainer} key={index}>
                                        <Star width={12} height={12} />
                                    </View>
                                )))}

                                <Text style={styles.profileText}>({numOfRating})</Text>
                            </View>
                            <Text style={styles.profileText}>GPA: {gpa}</Text>
                        </View>
                        <Image style = {styles.profilePic} source={{ uri: profilePic }}/>
                    </View>

                    <View style ={styles.body}>
                        <Text style={styles.qualification}>{qualification}</Text>
                        <Text style= {styles.text}>Tutoring for: {tutorFor.join(", ")} students</Text>
                        <Text style= {styles.text}>Languages: {languages.join(", ")}</Text>
                        <Text style= {styles.text}>Location: {location}</Text>
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

                    <View style={styles.userRating}>
                        {[1,2,3,4,5].map(((rating, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => {
                                    handleRating(index)}}
                            >
                                <Image source={star} style={styles.ratingStar} 
                                    tintColor={index < userRating ? "#FFC839" : "#E5E9EC"}
                                />
                            </TouchableOpacity>
                        )))}
                    </View>
                    
                    <View style={{
                        marginBottom: "25%"
                    }} />
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
      },
    profileText: {
        fontWeight: "500",
        margin: "1%",
        fontSize: "13rem",
        marginRight: "3%"
    },
    name: {
        fontSize: "24rem", 
        fontWeight: '800', 
        fontFamily:'Roboto',
        // marginHorizontal: "2%",
        marginBottom: "5%",
        flexWrap: "wrap",
        width: "210rem"
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
        marginRight: "2%",
        borderRadius: 100
    },

    body: {
        marginVertical: "4%",
        marginHorizontal: "2%",
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width: "350rem",
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
        width: "355rem"
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
        backgroundColor: '#8DC9EB', 
        alignItems: 'center', 
        borderRadius: 7, 
        justifyContent: 'center',
        margin: "0.5%",
        padding: "8rem",
    },
    content: {
        marginTop: "5%",
        flexWrap: "wrap",
        marginHorizontal: "3.5%",
        width: "350rem",
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
    userRating: {
        flexDirection: "row",
        marginVertical: "10%",
    },
    ratingStar: {
        width: "40rem",
        height: "40rem",
        margin: "1%",
    }
});

export default Details;
