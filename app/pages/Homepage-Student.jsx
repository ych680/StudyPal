import { useWindowDimensions, StyleSheet, TextInput, View, Text, ScrollView, Image, TouchableOpacity, FlatList, Dimensions, ActivityIndicator, RefreshControl } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import React, { Fragment, useEffect, useLayoutEffect, useState } from 'react'
import 'react-native-gesture-handler'
import EStyleSheet from 'react-native-extended-stylesheet';

import Filter from './Filter';

// Firebase
import {
    getDocs,
    collection,
    onSnapshot,
    doc,
    query,
    where,
    orderBy,
    limit,
    startAfter
} from "firebase/firestore";
import { auth, database } from "../config/firebase";

// Icons & images
const chatnow = require("../assets/icons/Chat1.png");
const search = require("../assets/icons/Search.png");
import Star from "../assets/icons/Star.svg";
const dell = require("../assets/icons/Dell.png");
import ExpandRight from "../assets/icons/Expand_right.svg";

// REM stylesheet
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});

export default function HomepageStudent () {
    const scale = useWindowDimensions().fontScale;

    const navigation = useNavigation();

    const [allData, setAlldata] = useState([]);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchterm , setSearchTerm]=useState("");
    const [lastVisible, setLastVisible] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const [selectedYL, setSelectedYL] = useState("");
    const [selectedG, setSelectedG] = useState("");
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState("");

    function getAllTutors() {
        setIsLoading(true);
        return new Promise((resolve, reject) => {
            const tutors = [];
            const tutorRef = collection(database, "Tutor");
            const firstQuery = query(tutorRef, orderBy("Fname"), limit(50));
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
        const nextQuery = query(tutorRef, orderBy("Fname"), startAfter(lastVisible), limit(50));
        getDocs(nextQuery).then(snapshot => {
            snapshot.forEach(doc => {
                tutors.push(doc.data());
            });
            setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
            setData(tutors);
        })
    }

    function getSelectedTutors() {
        setIsLoading(true);
        return new Promise((resolve, reject) => {
            const tutors = [];
            const tutorRef = collection(database, "Tutor");
            console.log("querying...");
            const querySubjects = query(tutorRef, 
                where("Subjects", "array-contains-any", selectedSubjects), limit(50));
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

    function getMoreSelectedTutors() {
        const tutors = [...data];
        const tutorRef = collection(database, "Tutor");
        console.log("querying...");
        const nextQuerySubjects = query(tutorRef, 
            where("Subjects", "array-contains-any", selectedSubjects), startAfter(lastVisible), limit(50));
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
        if (selectedSubjects.length > 0) {
            getSelectedTutors().finally(() => setIsRefreshing(false));
        } else {
             getAllTutors().finally(() => setIsRefreshing(false));
        }
    }

    // Get filter data from Firebase
    useEffect(() => {
        console.log("Getting filters in Homepage...");
        const filterRef = doc(database, "Student", auth.currentUser.email);
        onSnapshot(filterRef, snapshot => {
            setSearchTerm("");
            setSelectedItem();
            setSelectedSubjects(snapshot.get("Subjects"));
            setSelectedYL(snapshot.get("YearLevel"));
            setSelectedG(snapshot.get("TutorGender"));
            setSelectedLocation(snapshot.get("Location"));
        })
    }, []);

    // Get data
    useLayoutEffect(() => {
        console.log("Loading data...")
        setIsLoading(true);
        
        if (selectedSubjects.length > 0) {
            getSelectedTutors();
        } else {
            getAllTutors();
        }

    }, [selectedSubjects]);


    // Custom header
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

    const [selectedItem, setSelectedItem] = useState();

    const renderItem = ({item}) => {
        const backgroundColor = item === selectedItem ? '#FFC794' : '#FFF2E3';
        const color = item === selectedItem ? 'black' : '#2F323A';
        
        return (
        <TouchableOpacity 
            style={[styles.quickSelect, {
                backgroundColor: backgroundColor,
            }]}
            item={item}
            onPress={() => { 
                if (selectedItem === item) 
                    setSelectedItem()
                else 
                    setSelectedItem(item)
                }}
        >
            <Text style={[styles.quickSelectItemText, {
                color: color,
            }]}>{item}</Text>
        </TouchableOpacity>
        );
    };
    
    // Renders the tutor block
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
                    location: block.Location,
                })}
            >

                {/* Block container */}
                <View style={{flexDirection: "row", justifyContent: "space-between"}}>

                    {/* Profile & rating and Details and Tags Container */}
                    <View>

                        {/* Profile & rating and Details container */}
                        <View style={{flexDirection: "row", justifyContent: "space-between"}}>

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
                                <View style={{ flexDirection: "row", justifyContent: "center", marginTop: "10%" }}>
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
                                
                                <View style={{flex: 1, height: 1.5, backgroundColor: '#8DC9EB'}} />

                                <View style={styles.infotextFlow}>
                                    <Text style={styles.qualification}>
                                        {
                                            block.Qualification.length > 0 ?
                                            block.Qualification
                                            : "This is a Bio"
                                        }

                                    </Text>
                                </View>
                                
                                {
                                    block.TutorFor.length != 0
                                    ?
                                    <View style={[styles.infotextFlow, {marginTop: "2%"}]}>
                                        <Text style={styles.infotext} numberOfLines={1}>Tutors for: {block.TutorFor.join(", ")}</Text>
                                    </View>
                                    : null
                                }

                                <View style={styles.infotextFlow}>
                                    <Text style={styles.infotext} numberOfLines={1}>Location: {block.Location}</Text>
                                </View> 

                                {/* Tags container */}
                                <View style={[styles.tagsContainer, {
                                    
                                }]} >
                                    {block.Subjects?.map(((tag, index) => {
                                        if (searchterm !== "" && tag.toLowerCase().includes(searchterm.toLowerCase())) {
                                            return (
                                                <View style={styles.tagBox} key={index}>
                                                    <Text style={styles.tagtext}>{tag}</Text>
                                                </View> 
                                            )
                                        } else if (selectedSubjects.includes(tag)) {
                                            if (selectedItem === tag)
                                                return (
                                                    <View style={styles.tagBox} key={index}>
                                                        <Text style={styles.tagtext}>{tag}</Text>
                                                    </View> 
                                            )
                                            else if (!selectedItem) {
                                                return (
                                                    <View style={styles.tagBox} key={index}>
                                                        <Text style={styles.tagtext}>{tag}</Text>
                                                    </View> 
                                                )
                                            }
                                        } else if (selectedSubjects.length === 0 && index < 2) {
                                            return (
                                                <View style={styles.tagBox} key={index}>
                                                    <Text style={styles.tagtext}>{tag}</Text>
                                                </View> 
                                            )
                                        } 
                                        }
                                            
                                    ))}
                                </View>
                                
                            </View>

                        </View>

                    </View>

                    {/* GPA and message icon container */}
                    <View style={{justifyContent: "space-between", alignItems: "center", marginVertical: "1.5%"}}>
                        <Text>GPA {block.GPA}</Text>

                        <View style={{marginTop: 10}}>
                            <ExpandRight width={25}/>
                            {/* <Text style={styles.more}>More</Text> */}
                        </View>
                       

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
                                if (selectedSubjects.length > 0) {
                                    getMoreSelectedTutors();
                                } else {
                                    getMoreTutors();
                                }
                            }
                        }}
                        scrollEventThrottle={400}
                        showsVerticalScrollIndicator={false}
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
                            {
                                searchterm.length > 0
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
                        <Filter/>
                        </View>

                       

                        {/* Quickselect Btns */}
                        {
                            selectedSubjects.length > 1
                            ?
                            <>
                                <View>
                                    <Text style={styles.quickSelectText}>Quick Select</Text>
                                </View>
                                <FlatList 
                                    data={selectedSubjects}
                                    renderItem={renderItem}
                                    horizontal
                                    keyExtractor={item => item}
                                    // extraData={selectedItem}
                                    showsHorizontalScrollIndicator={false}
                                />
                            </>
                            : null
                        }
                        
                        

                        {/* {console.log("Year level:", selectedYL, "\n", "Subject:", selectedSubjects, "\n", "Location:", selectedLocation)} */}
                        {/* Tutor tabs */}

                         {/* Filterting year levels */}
                        {
                            searchterm.length > 0 ?
                            allData.filter((tutor)=> tutor.Fname.toLowerCase().includes(
                                searchterm.toLowerCase()) || tutor.Lname.toLowerCase().includes(searchterm.toLowerCase()) ||
                                tutor.Subjects.toString().toLowerCase().includes(searchterm.toLowerCase())
    
                            )?.map((block) => (
                                renderTabs({block})
                            ))
                            :
                                data.filter(obj => {
                                    if (selectedG === 'Any' && selectedLocation === 'Any') {
                                        return obj["TutorFor"].includes(selectedYL);
                                    } else if (selectedG === 'Any') {
                                        return obj["TutorFor"].includes(selectedYL) && obj["Location"] === selectedLocation;
                                    } else if (selectedLocation === 'Any') {
                                        return obj["TutorFor"].includes(selectedYL) && obj["Gender"] === selectedG;
                                    } else {
                                        return obj["TutorFor"].includes(selectedYL) 
                                        && obj["Gender"] === selectedG
                                        && obj["Location"] === selectedLocation;
                                    }
                                }).length > 0
                                ?
                                    selectedItem !== undefined // if quick select is selected
                                    ?
                                        data.filter(obj => {
                                            if (selectedG === 'Any' && selectedLocation === 'Any') {
                                                return obj["TutorFor"].includes(selectedYL)
                                                && obj["Subjects"].includes(selectedItem);
                                            } else if (selectedG === 'Any') {
                                                return obj["TutorFor"].includes(selectedYL) 
                                                && obj["Location"] === selectedLocation
                                                && obj["Subjects"].includes(selectedItem);
                                            } else if (selectedLocation === 'Any') {
                                                return obj["TutorFor"].includes(selectedYL) 
                                                && obj["Gender"] === selectedG
                                                && obj["Subjects"].includes(selectedItem);
                                            } else {
                                                return obj["TutorFor"].includes(selectedYL) 
                                                && obj["Gender"] === selectedG
                                                && obj["Location"] === selectedLocation
                                                && obj["Subjects"].includes(selectedItem);
                                            }
                                        }).length > 0 
                                        ?
                                        data.filter(obj => {
                                            if (selectedG === 'Any' && selectedLocation === 'Any') {
                                                return obj["TutorFor"].includes(selectedYL)
                                                && obj["Subjects"].includes(selectedItem);
                                            } else if (selectedG === 'Any') {
                                                return obj["TutorFor"].includes(selectedYL) 
                                                && obj["Location"] === selectedLocation
                                                && obj["Subjects"].includes(selectedItem);
                                            } else if (selectedLocation === 'Any') {
                                                return obj["TutorFor"].includes(selectedYL) 
                                                && obj["Gender"] === selectedG
                                                && obj["Subjects"].includes(selectedItem);
                                            } else {
                                                return obj["TutorFor"].includes(selectedYL) 
                                                && obj["Gender"] === selectedG
                                                && obj["Location"] === selectedLocation
                                                && obj["Subjects"].includes(selectedItem);
                                            }
                                        })?.map((block) => (
                                            renderTabs({block})
                                        ))
                                        :
                                        <View style={{
                                            width: "100%",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            marginVertical: "5%",
                                        }}>
                                            <Text style={{
                                                fontStyle: "italic",
                                            }}>No tutors availabe. Try other subjects.</Text>
                                        </View>     
                                : // if quick select is not selected
                                data.filter(obj => {
                                    if (selectedG === 'Any' && selectedLocation === 'Any') {
                                        return obj["TutorFor"].includes(selectedYL);
                                    } else if (selectedG === 'Any') {
                                        return obj["TutorFor"].includes(selectedYL) && obj["Location"] === selectedLocation;
                                    } else if (selectedLocation === 'Any') {
                                        return obj["TutorFor"].includes(selectedYL) && obj["Gender"] === selectedG;
                                    } else {
                                        return obj["TutorFor"].includes(selectedYL) 
                                        && obj["Gender"] === selectedG
                                        && obj["Location"] === selectedLocation;
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
        marginVertical: "2.3%",
        backgroundColor: "#B4E8FF",
        borderRadius: 15,
        padding: "3%",
        paddingLeft: "1%",
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
    },
    // PROFILE PIC
    profilePicContainer: {
        width: "70rem",
        height: "70rem",
        marginTop: "5%",
        marginRight: "3%",
    },
    profilePic: {
        width: "70rem",
        height: "70rem",
        borderRadius: 100,
        borderWidth: 1.5,
        borderColor: "white",
        backgroundColor: "white"
    },
    // RATINGS
    starContainer: {
        width: "10rem",
        height: "10rem",
        margin: "0.7rem"
    },
    // TUTOR NAME
    name: {
        fontSize: "16rem", 
        fontWeight: "500",
        // textDecorationLine: "underline"
    },
    // TUTOR INFO
    infoBox: {
        // marginHorizontal: "2%",
        marginVertical: "1%"
    },
    infotextFlow: {
        flexGrow: 1, 
        flexDirection: "row", 
        width: "180rem",
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
        color: "grey",
        marginRight: "",
    },
    // TAGS
    tagsContainer: {
        flexWrap: "wrap",
        flexDirection: "row",
        overflow: "hidden",
        marginTop: "5%",
        marginHorizontal: "1%",
        width: "200rem",
    },
    tagBox: {
        margin: "1%",
        paddingHorizontal: "10rem",
        paddingVertical: "5rem",
        backgroundColor: "#8DC9EB",
        borderRadius: 6,
    },
    tagtext: {
        fontSize: "12rem", 
        fontWeight: "400"
    },
    searchContainer: {
        flex: 1,
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
        width: "200rem",
        // backgroundColor: "grey"
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
