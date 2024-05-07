import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native'
import React, { useState, useRef, useCallback, useEffect, useLayoutEffect} from 'react'
import 'react-native-gesture-handler'
import { BottomSheetModal, BottomSheetFooter, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import EStyleSheet from 'react-native-extended-stylesheet';

const search = require("../assets/icons/Search.png");
import FilterIcon from "../assets/icons/Filter.svg";

// Firebase
import {
    getDoc,
    collection,
    doc,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import { auth, database } from "../config/firebase";

// REM stylesheet
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});

const Filter = ({props}) => {

    // console.log(props.selectedSubjects)

    const [text, setText] = useState("");

    const bottomSheetModalRef = useRef(null);

    const snapPoints = ["80 %","95 %"];

    const [selectedYL, setSelectedYL] = useState("Stage 1");

    const year = ["Stage 1", "Stage 2", "Stage 3", "Stage 4"];

    const [selectedG, setSelectedG] = useState("");
    const gender = ["Female", "Male", "Any"];

    const subjects = [{name:"Law", pressed: false}, {name:"Arts", pressed: false}, {name:"Business", pressed: false}, {name:"Chemistry", pressed: false}, {name:"Biological Sciences", pressed: false}, {name:"Math", pressed: false}, {name:"History", pressed: false}, {name:"Engineering", pressed: false}, {name:"Psychology", pressed: false}, {name:"Economics", pressed: false}, {name:"Computer Science", pressed: false}, {name:"Anthropology", pressed: false}, {name:"Education", pressed: false}, {name:"Philosophy", pressed: false}, {name:"Architechture", pressed: false}, {name:"Physics", pressed: false}];

    const [list, setList] = React.useState(subjects);
    const [selectedSubjects, setSelectedSubjects] = useState([]);

    // useEffect(() => {
    //     setSelectedSubjects(props.selectedSubjects);
    //     setSelectedYL(props.selectedYL);
    //     setSelectedG(props.selectedG);
    //     selectedSubjects.forEach(subject => {
    //         handleSubjectToggle(subject);
    //         // console.log(subject);
    //     })
    // }, [])

    useEffect(() => {
        console.log("Getting filters in Filter.js...");
        const filtersRef = doc(database, "Student", auth.currentUser.email);
        getDoc(filtersRef).then(snapshot => {
            // console.log("filter", snapshot.get("Subjects"));
            setSelectedSubjects(snapshot.get("Subjects"));
            setSelectedYL(snapshot.get("YearLevel"));
            setSelectedG(snapshot.get("TutorGender"));
            const newList = list.map((item) => {
                if (snapshot.get("Subjects").includes(item.name)) {
                    const updatedItem = {
                    ...item,
                    pressed: true,
                    };
                    return updatedItem;
                }
                return item;
            });
            
            setList(newList); 
        })
        // console.log(selectedSubjects);
    }, [props]);

    // list.map((subject, index) => {
    //     let i = selectedSubjects.indexOf(subject.name);
    //     if (subject.pressed === true) {
    //         if (i === -1) {
    //             selectedSubjects.push(subject.name);
    //         }
    //     } else {
    //         if (i >= 0) {
    //             selectedSubjects.splice(i, 1);
    //         }
    //     }
    // })

    const applyFilter = () => {
        const filterRef = doc(database, "Student", auth.currentUser.email);
        updateDoc(filterRef, {
            Subjects: selectedSubjects,
            TutorGender: selectedG,
            YearLevel: selectedYL,
        })
    }

    function handleSubjectToggle(name) {
        const newList = list.map((item) => {
        if (item.name === name) {
            const updatedItem = {
            ...item,
            pressed: !item.pressed,
            };
            let i = selectedSubjects.indexOf(item.name);
            if (!item.pressed === true) {
                selectedSubjects.push(item.name);
            } else {
                selectedSubjects.splice(i, 1);
            }
            // console.log(updatedItem, selectedSubjects);
            return updatedItem;
        }
        return item;
        });
    
        setList(newList); 
    }

    function handleSubjectReset() {
        const newList = list.map((item) => {
            const updatedItem = {
                ...item,
                pressed: false,
            };
        
            return updatedItem;
        
            return item;
            });
            setSelectedSubjects([]);
        
            setList(newList); 
    }

    function handlePresentModal(){
        bottomSheetModalRef.current?.present();
    }
    
    return (
        <View>

            {/* Search bar */}
            <View style={styles.searchBar}> 

                {/* Search */}
                {/* <View style={styles.searchContainer}>  
                    <Image source={search} style={styles.searchIcon} />
                    <TextInput 
                        style={styles.searchText}
                        placeholder="Search subjects"
                        placeholderTextColor="#7A7F8E"
                    />
                </View> */}

                {/* Filter */}
                <TouchableOpacity style={styles.filterBox} onPress={handlePresentModal}>
                   
                    <FilterIcon style={styles.filterIcon} />
                    <Text style={styles.filterText}>FILTERS</Text>

                </TouchableOpacity>
            </View>


            {/* Filter Popup */}
            <BottomSheetModal
                    ref={bottomSheetModalRef}
                    index={0}
                    snapPoints={snapPoints}
                    backgroundStyle={styles.background}
                    // footerComponent={renderFooter}
                >
                    <View style={{flex:1, alignItems: "center", paddingHorizontal: 15, }}>
                        {/* <Text style={styles.header}>Filter</Text> */}

                        <TouchableOpacity style={styles.applyBox} onPress={() => {
                                applyFilter();
                                bottomSheetModalRef.current.close();
                            }} activeOpacity={0.75}>
                            <Text style={styles.applyText}>Apply Filter</Text>
                        </TouchableOpacity>
    
                        {/* Container */}
                        
                        <View style={styles.row}>
                            <Text style={styles.title}>Year Level</Text>

                            
                            
                            {/* Year level */}
                            <View style={styles.container}>
                            {year.map(((level, index) => (
                                <TouchableOpacity
                                    onPress={() => setSelectedYL(level)}
                                    style={[styles.button, { backgroundColor: selectedYL==level ? "#0AAAC0" : "#E5E9EC" }]}
                                    key = {index}
                                >
                                    <Text style= {[styles.buttonText, { color: selectedYL==level ? "#FFFFFF" :"black" }]}>{level}</Text>
    
                                </TouchableOpacity>
                            )))}
                            </View>
    
                            <Text style={styles.title}>Tutor Gender</Text>
                            
                            {/* Gender */}
                            <View style={styles.container}>
                            {gender.map(((sex, index) => (
                                <TouchableOpacity
                                    onPress={() => setSelectedG(sex)}
                                    style={[styles.button, { backgroundColor: selectedG == sex ? "#0AAAC0" : "#E5E9EC" }]}
                                    key={index}
                                >
                                    <Text style= {[styles.buttonText, { color: selectedG == sex ?"#FFFFFF" :"black" }]}>{sex}</Text>
    
                                </TouchableOpacity>
                            )))}
                            </View>

                            <View style={{flexDirection: "row", alignItems: "center", }}>
                              <Text style={styles.title}>Subjects   |</Text>
                              <TouchableOpacity onPress={() => handleSubjectReset()}>
                                <Text style= {[styles.title, {marginLeft: "15%", marginTop: "11%", color: "#0065CC", fontWeight: 400}]}>Reset</Text>
                              </TouchableOpacity>
                            </View>
                            {/* Subjects */}
                            <View style={styles.container}>
                            {list.map(((course, index) => (
                                <TouchableOpacity
                                onPress={() => handleSubjectToggle(course.name)}
                                style={[styles.button, { backgroundColor: course.pressed? "#0AAAC0" :"#E5E9EC" }]}
                                key={index}
                                >
                                    <Text style= {[styles.buttonText, { color: course.pressed? "#FFFFFF" :"black" }]}>{course.name}</Text>
    
                                </TouchableOpacity>
                            )))}
                            </View>
                            
                        </View>
                    </View>
                </BottomSheetModal>

        </View>
    )
}

export default Filter

const styles = EStyleSheet.create({
    background: {
        shadowOffset: {
            width: 0,
            height: 1,
          },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
        borderRadius:50,
        shadowColor: "#171717"
    },
    row:{
        width: "100%",
        // flexDirection: "row",
        // alignItems: "center",
        // justifyContent: "space-between"

    },
    header: {
        fontWeight: "600",
        letterSpacing: .5,
        fontSize: "18rem",
        marginBottom: "4%",
    },
    subtitle:{
        color:"#101318",
        fontSize: "14rem",
        fontWeight: "500",

    },
    title: {
        fontSize: "16rem",
        fontWeight: "500",
        letterSpacing: 0.5,
        // width: "100%", 
        marginTop: "5%", 
        marginBottom: "3%", 
        marginLeft: "3%",
        fontFamily: "Inter",
    },
    button: {
        marginHorizontal: "0.5%",
        marginVertical: "0.7%",
        borderRadius: 20,
        paddingVertical: "2.5%",
        paddingHorizontal: "2.5%",
        justifyContent: 'center',
        alignItems: 'center',

    },
    buttonText: {
        color: 'white',
        fontWeight: 'regular', 
        fontSize: "16rem",
        textAlign: "center",
        paddingHorizontal: "1.5%",
        
    },
    container: {
        // width : Dimensions.get('window').width,
        flexWrap: 'wrap',
        flexDirection: "row",
        justifyContent: "flex-start",
        
    },
    searchBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        // backgroundColor: "grey"
    },
    searchContainer: {
        flexDirection: "row",
        backgroundColor: "#edeff0",
        marginHorizontal: "3%",
        marginVertical: "2%",
        height: "35rem",
        borderRadius: 10,
    },
    searchText: {
        marginHorizontal: "2%",
        fontSize: "14rem",
        fontWeight: "300",
        opacity: 10,
        width: "58%"
    },
    searchIcon: {
        height: "22rem",
        width: "20rem",
        marginLeft: "3%",
        alignSelf: "center"
    },
    filterBox: {
        // height: "40rem",
        // width: "40rem",
        justifyContent: "center",
        alignItems: "center",
        marginRight: "3%",
        borderColor: "#6a6a6a",
        borderWidth: 1,
        borderRadius: 10,
        flexDirection: "row",
    },
    filterText: {
        marginHorizontal: "1%",
        marginRight: "2%"
    },
    filterIcon: {
        height: "32rem",
        width: "32rem",
    },
    applyBox: {
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: "2%",
        marginHorizontal: "1%",
        paddingVertical: "4%",
        borderRadius: 25,
        width: "85%",
        alignSelf: "center",
        borderWidth: 1,
        borderColor: "black",

        shadowColor: "black",
        shadowOffset: {
            width: 0,
            height: 12,
          },
        shadowOpacity: 0.25,
        shadowRadius: 8.0,
        elevation: 8,
    },
    applyText: {
        color: "black",
        fontSize: "18rem",
        fontWeight: "600"
    }
})
