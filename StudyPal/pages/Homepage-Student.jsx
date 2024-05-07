import { View, Text, ScrollView, Image, TouchableOpacity, FlatList, Dimensions, ActivityIndicator, RefreshControl, TextInput } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import React, { Fragment, useEffect, useLayoutEffect, useState } from 'react'
import 'react-native-gesture-handler'
import EStyleSheet from 'react-native-extended-stylesheet';

import Filter from './Filter';
import { MessageTutor } from '../components/MessageTutor';
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

// Firebase
import {
    getDocs,
    collection,
    getDoc,
    onSnapshot,
    doc,
    query,
    where,
    orderBy,
    limit,
    startAfter
} from "firebase/firestore";
import { auth, database } from "../config/firebase";

import subject from '../data/subject';
import tutor from '../data/tutor';

// Icons & images
const chatnow = require("../assets/icons/Chat1.png");
const search = require("../assets/icons/Search.png");
import Star from "../assets/icons/Star.svg";

// REM stylesheet
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});

export default function HomepageStudent () {
    const navigation = useNavigation();

    const quickSelectSubjects = [];

    subject.slice(0,5).forEach(element => {
        quickSelectSubjects.push(element.name);
    });

    //console.log(quickSelectSubjects);

    // const tutors = tutor;

    // const navigation = useNavigation();
    const [allData, setAlldata] = useState([]);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchterm , setSearchTerm]=useState("");
    const [lastVisible, setLastVisible] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const [selectedYL, setSelectedYL] = useState("");
    const [selectedG, setSelectedG] = useState("");
    const [selectedSubjects, setSelectedSubjects] = useState([]);

    // console.log("this is search" + allData.filter((tutor) => {
    //     tutor.Fname.toLowerCase().includes(
    //     searchterm.toLowerCase()) || tutor.Lname.toLowerCase().includes(searchterm.toLowerCase())}))

    // console.log( allData.filter((tutor)=> tutor.Fname.toLowerCase().includes(
    //     searchterm.toLowerCase()) || tutor.Lname.toLowerCase().includes(searchterm.toLowerCase())
    
    //     ))

    // console.log(allData);

    function getAllTutors() {
        setIsLoading(true);
        return new Promise((resolve, reject) => {
            const tutors = [];
            const tutorRef = collection(database, "Tutor");
            const firstQuery = query(tutorRef, orderBy("Fname"), limit(6));
            getDocs(firstQuery).then(snapshot => {
                snapshot.forEach(doc => {
                    tutors.push(doc.data());
                });
                setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
                setData(tutors);
                setAlldata(tutors);
                resolve();
            })
            .catch(error => {
                console.error("Error fetching tutors: ", error);
                reject(error);
            })
            .finally(() => {
                if (!isRefreshing) {
                    setIsLoading(false);
                }
                console.log("Set is loading false");
            });
        });
    }

    function getMoreTutors() {
        if (!lastVisible) {
            console.log("No more tutors to load");
            return;
        }
    
        const tutors = [...data];
        const tutorRef = collection(database, "Tutor");
        const nextQuery = query(tutorRef, orderBy("Fname"), startAfter(lastVisible), limit(5));
        getDocs(nextQuery).then(snapshot => {
            snapshot.forEach(doc => {
                tutors.push(doc.data());
            });
            setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
            setData(tutors);
        })
    }

    function getSelectedTutors() {
        const tutors = [];
        const tutorRef = collection(database, "Tutor");
        console.log("querying...");
        const querySubjects = query(tutorRef, 
            where("Subjects", "array-contains-any", selectedSubjects), limit(5));
        getDocs(querySubjects).then(snapshot => {
            if (snapshot.empty) {
                setData(new Array());
            } else {
                snapshot.forEach(doc => {
                    tutors.push(doc.data());
                })
                setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
                setData(tutors);
            }
            
        }).then(() => {
            setIsLoading(false);
            console.log("Set is loading false");
        })
    }

    function getMoreSelectedTutors() {
        const tutors = [...data];
        const tutorRef = collection(database, "Tutor");
        console.log("querying...");
        const nextQuerySubjects = query(tutorRef, 
            where("Subjects", "array-contains-any", selectedSubjects), startAfter(lastVisible), limit(5));
        getDocs(nextQuerySubjects).then(snapshot => {
            if (!snapshot.empty) {
                snapshot.forEach(doc => {
                    tutors.push(doc.data());
                })
                setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
                setData(tutors);
            }
        }).then(() => {
            setIsLoading(false);
            console.log("Set is loading false");
        })
    }

    function onRefresh() {
        setIsRefreshing(true);
        // Here, you can call the function that fetches the tutors again
        getAllTutors().finally(() => setIsRefreshing(false));
    }

    useEffect(() => {
        console.log("Getting filters in Homepage...");
        const filterRef = doc(database, "Student", auth.currentUser.email);
        onSnapshot(filterRef, snapshot => {
            setSearchTerm("");
            setSelectedSubjects(snapshot.get("Subjects"));
            setSelectedYL(snapshot.get("YearLevel"));
            setSelectedG(snapshot.get("TutorGender"));
        })
    }, []);

    // console.log(selectedSubjects);

    useLayoutEffect(() => {
        console.log("Loading data...")
        setIsLoading(true);
        
        console.log("Selected subjects in homepage", selectedSubjects);
        if (selectedSubjects.length > 0) {
            getSelectedTutors();
        } else {
            getAllTutors();
        }
        // getAllTutors();

    }, [selectedSubjects]);


    // console.log(data);

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => (
                <Fragment>
                    <SafeAreaView edges={["top"]} style={{backgroundColor: "#FAFAFA"}} />
                    <View style={styles.titleContainer} >
                        <Text style={styles.titleText}>Find your tutor</Text>
                    </View>
                </Fragment>
            )
        })
    });
    

    const renderTabs = ({ block }) => {
        return (
            <TouchableOpacity
                key={block._id}
                style={styles.block}
                onPress={() => navigation.navigate("Details", { 
                    name: block.Fname + " " + block.Lname,
                    bio: block.Bio,
                    rating: block.Rating,
                    gpa: block.GPA,
                    profilePic: block.ProfilePic,
                    qualification: block.Qualification,
                    subjects: block.Subjects,
                    tutorFor: block.TutorFor,
                    languages: block.Languages,
                    email: block._id,
                })}
            >

                {/* Block container */}
                <View style={{flexDirection: "row"}}>

                    {/* Profile & rating and Details and Tags Container */}
                    <View>

                        {/* Profile & rating and Details container */}
                        <View style={{flexDirection: "row"}}>

                            {/* Profile image and rating container */}
                            <View style={{justifyContent: "center", alignItems: "center"}}>

                                {/* Profile image */}
                                <View style={styles.profilePicContainer}>
                                    <Image 
                                        source={{ uri: block.ProfilePic }}
                                        style={styles.profilePic}
                                        resizeMode='contain'
                                    />
                                </View>

                                {/* Ratings */}
                                <View style={{ flexDirection: "row", justifyContent: "center", marginRight: 5 }}>
                                    {Array.apply(null, { length: Math.round(block.Rating) }).map(((rating, index) => (
                                        <View style={styles.starContainer} key={index} >
                                            <Star width={10} height={10} />
                                        </View>
                                    )))}
                                </View>

                            </View>
                            
                            {/* Info container */}
                            <View style={styles.infoBox}>
                                <Text style={styles.name}>{block.Fname} {block.Lname}</Text>
                                <View style={styles.infotextFlow}>
                                    <Text style={styles.qualification}>{block.Qualification}</Text>
                                </View>
                                
                                {
                                    block.TutorFor.length != 0
                                    ?
                                    <View style={styles.infotextFlow}>
                                        <Text style={styles.infotext}>Tutors for: {block.TutorFor.join(", ")}</Text>
                                    </View>
                                    : null
                                }
                            
                                {
                                    block.Languages.length!= 0
                                    ?
                                    <View style={styles.infotextFlow}>
                                        <Text style={styles.infotext}>Language: {block.Languages.join(", ")}</Text>
                                    </View> 
                                    : null
                                }
                                
                            </View>

                        </View>

                        {/* Tags container */}
                        <View style={styles.tagsContainer} >
                            {block.Subjects?.map(((tag, index) => {
                                return (
                                    <View style={styles.tagBox} key={index}>
                                        <Text style={styles.tagtext}>{tag}</Text>
                                    </View> 
                                )}
                            ))}
                        </View>

                    </View>

                    {/* GPA and message icon container */}
                    <View style={{justifyContent: "space-between", alignItems: "center", marginBottom: "2%"}}>
                        <Text>GPA {block.GPA}</Text>

                        <TouchableOpacity 
                            style={styles.chatBox}
                            onPress={() => MessageTutor({ navigation: navigation, name: block.Fname + " " + block.Lname, email: block._id })}
                        >
                            <Image source={chatnow} style={styles.filterIcon} />
                        </TouchableOpacity>

                        <Text style={styles.more}>More</Text>
                    </View>
                    
                </View>

            </TouchableOpacity>
        )
    }

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
                    {isLoading && !isRefreshing && <ActivityIndicator size="large" color="orange" />}
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={onRefresh}
                            />
                        }
                        onScroll={({nativeEvent}) => {
                            if (isCloseToBottom(nativeEvent)) {
                                getMoreTutors();
                            }
                        }}
                        scrollEventThrottle={400}
                    >

                        {/* Search bar + Filter */}
                        <View style={styles.searchBar}> 

                        {/* Search */}
                        <View style={styles.searchContainer}>  
                            <Image source={search} style={styles.searchIcon} />
                            <TextInput 
                                style={styles.searchText}
                                placeholder="Search tutor or subjects"
                                placeholderTextColor="#7A7F8E"
                                onChangeText={(text) => setSearchTerm(text)}
                                value={searchterm}
                            />
                        </View>
                        <Filter/>
                        </View>

                        <View>
                            <Text style={styles.quickSelectText}>Quick Select</Text>
                        </View>

                        {/* Quickselect Btns */}
                        <FlatList 
                            data={quickSelectSubjects}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.quickSelect}>
                                    <Text style={styles.quickSelectItemText}>{item}</Text>
                                </TouchableOpacity>
                            )}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        />

                        {console.log("Year level:", selectedYL, "\n", "Subject:", selectedSubjects)}
                        {/* Tutor tabs */}
                        {/* {console.log("filtered data:", data.filter(obj => {
                                if (selectedG === 'Any') {
                                    return obj["TutorFor"].includes(selectedYL);
                                } else {
                                    return obj["TutorFor"].includes(selectedYL) && obj["Gender"] === selectedG;
                                }
                        }))} */}

                         {/* Filterting year levels */}
                        {
                            searchterm.length > 0 ?
                            <>
                            {allData.filter((tutor)=> tutor.Fname.toLowerCase().includes(
                                searchterm.toLowerCase()) || tutor.Lname.toLowerCase().includes(searchterm.toLowerCase()) ||
                                tutor.Subjects.toString().toLowerCase().includes(searchterm.toLowerCase())
    
                            )?.map((block) => (
                                renderTabs({block})
                            ))}
                            {/* {console.log(allData.filter((tutor) => {
                                    tutor.Fname.toLowerCase().includes(
                                    searchterm.toLowerCase()) || tutor.Lname.toLowerCase().includes(searchterm.toLowerCase());
                            }))} */}
                            </>
                            :
                            <>
                            {
                                data.filter(obj => {
                                    if (selectedG === 'Any') {
                                        return obj["TutorFor"].includes(selectedYL);
                                    } else {
                                        return obj["TutorFor"].includes(selectedYL) && obj["Gender"] === selectedG;
                                    }
                                }).length > 0
                                ?
                                data.filter(obj => {
                                    if (selectedG === 'Any') {
                                        return obj["TutorFor"].includes(selectedYL);
                                    } else {
                                        return obj["TutorFor"].includes(selectedYL) && obj["Gender"] === selectedG;
                                    }
                                
                                })?.map((block) => (
                                    renderTabs({block})
                                ))
                                : // if there are no tutors with that filter
                                <View style={{
                                    width: "100%",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginVertical: "5%",
                                }}>
                                    <Text style={{
                                        fontStyle: "italic",
                                    }}>No tutors availabe. Try other filter settings.</Text>
                                </View>     
                            }  
                            </>
                        }
                        
                        
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

    // QUICK SELECT
    quickSelectText: {
        fontWeight: "300", 
        color: "#2F323A",
        marginLeft: "6%",
        marginBottom: "2rem",
    },
    quickSelect: {
        marginHorizontal: "3rem",
        marginTop: "2rem",
        marginBottom: "5rem",
        backgroundColor: "#FFE7CA",
        borderRadius: 20,
        paddingVertical: "8rem",
        paddingHorizontal: "13rem",
        borderWidth: 1,
        borderColor: "#DE813E",
    },
    quickSelectItemText: {
        fontSize: "14rem", 
        fontWeight: "300",
        color: "#2F323A"
    },

    // TUTOR BLOCK
    block: {
        marginHorizontal: "3%",
        marginVertical: "1.5%",
        backgroundColor: "#B4E8FF",
        borderRadius: 20,
        padding: "3%",
        shadowColor: '#171717',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
    },
    // PROFILE PIC
    profilePicContainer: {
        width: "60rem",
        height: "60rem",
    },
    profilePic: {
        width: "55rem",
        height: "55rem",
    },
    // RATINGS
    starContainer: {
        width: "10rem",
        height: "10rem",
    },
    // TUTOR NAME
    name: {
        fontSize: "16rem", 
        fontWeight: "500"
    },
    // TUTOR INFO
    infoBox: {
        marginHorizontal: "2%",
        marginVertical: "0.5%"
    },
    infotextFlow: {
        flexGrow: 1, 
        flexDirection: "row", 
        width: "200rem"
    },
    qualification: {
        flex: 1, 
        fontSize: "14rem", 
        fontWeight: "400"
    },
    infotext: {
        flex: 1, 
        fontSize: "11rem", 
        fontWeight: "300"
    },
    // CHAT ICON
    chatBox: {
        margin: "2%",
        backgroundColor: "#fff",
        borderRadius: 20,
        width: "50rem",
        height: "40rem",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: '#171717',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
    },
    filterIcon: {
        width: "38rem",
        height: "38rem"
    },
    more: {
        fontWeight: "200",
        fontSize: "11rem",
    },
    // TAGS
    tagsContainer: {
        flexWrap: "wrap",
        flexDirection: "row",
        overflow: "hidden",
        marginTop: "1%",
        marginRight: "1%",
        height: "40rem",
        width: "270rem"
    },
    tagBox: {
        margin: "1%",
        padding: "9rem",
        backgroundColor: "#42CAF5",
        borderRadius: 6,
    },
    tagtext: {
        fontSize: "12rem", 
        fontWeight: "400"
    },
    searchContainer: {
        flexDirection: "row",
        backgroundColor: "#edeff0",
        marginHorizontal: "3%",
        marginVertical: "2%",
        height: "35rem",
        borderRadius: 10,
        width: "70%"
    },
    searchIcon: {
        height: "22rem",
        width: "20rem",
        marginLeft: "3%",
        alignSelf: "center"
    },
    searchText: {
        marginHorizontal: "2%",
        fontSize: "14rem",
        fontWeight: "300",
        opacity: 10,
        // width: "70%"
    },
    searchBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        // backgroundColor: "grey"
    },
})

function isCloseToBottom({layoutMeasurement, contentOffset, contentSize}) {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
}
