import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, View, Image, TouchableOpacity, Text, StatusBar, Modal, TextInput} from 'react-native';
// import SwipeUpDownModal from 'react-native-swipe-modal-up-down';
import EStyleSheet from 'react-native-extended-stylesheet';
import {firebase} from '../firebaseConfig';

const TutorProfile = () => {
  
    const [modalVisible, setModalVisible] = useState(false);
    const [statusVisible, setStatusVisible] = useState(false);
  

//   render () {
//     const [tutors, setTutors] = useState([]);
//     const tutor = firebase.firestore().collection('Tutor');
//     useEffect(async () => {
//         tutor.onSnapshot(
//             querySnapShot => {
//                 const tutors = []
//                 querySnapShot.forEach((doc) => {
//                     const {heading, text} = doc.data()
//                     tutors.push({
//                         id: doc.id,
//                         heading,
//                         text,
//                     })
//                 })
//                 setTutors(tutors);
//             }
//             )
//     })
//     const render = ({t}) => (

//     )
    return (
        <SafeAreaView style={styles.container}>
        <View style={styles.bar}>
            <Text style={{fontSize: 40, fontFamily: 'Inter', fontWeight: 'bold'}}>My Profile</Text>

        </View>
        
        {/* <StatusBar/> */}
        <TouchableOpacity style= {{top: '8%'}}>
            <View style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center'
            }}>
            <Image 
            style={styles.img} 
            source={require('../assets/student-icon.png')} />
            <Text style={{fontSize: 28}}>Freddie Mata </Text>
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <Text style = {{fontSize: 20}}>Edit</Text>
                <Image style={{width: 50, height: 50}}source={require('../assets/arrow.png')} />
            </View>
            </View>
        </TouchableOpacity>

        {/* <View style={{
            top: '26%',
            left: '2%',
            flexDirection: 'row',
            alignItems: 'center',
            // justifyContent: 'space-between',
        }}>
            <Text style={{fontSize: 22, position: 'absolute', left: '3%'}}>Mode</Text>
            <View style={{flexDirection: 'row', position: 'absolute', right: '8%'}}>
            <View style={styles.studentbtn}>
                <Text style={{color: '#FFFFFF', fontSize: 20, fontWeight: '500'}}>Student</Text>
            </View>
            <View style={styles.tutorbtn}>
                <Text style={{color: '#000000', fontSize: 20, fontWeight: '500'}}>Tutor</Text>
            </View>
            </View>  
        </View> */}


        <View style={styles.box1}>

        <TouchableOpacity onPress={() => setStatusVisible(true)} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <Text style={{fontSize: 20, marginLeft: '4%', marginTop: '2%', marginBottom: '1%'}}>Set Status</Text>
            <View style={{flexDirection: 'row', alignItems: 'center', marginRight:'-45%'}}>
              <Image source={require('../assets/online.png')} />
              <Text style={{fontSize: 20, marginLeft: '5%'}}>Online</Text>
            </View>
            <Image style={{width: '15%', height: '100%', marginTop: '1%'}}source={require('../assets/arrow.png')} />
          </TouchableOpacity>
          
          {/* <GestureRecognizer onSwipeDown={()=> this.setState({show:false})}> */}
            <Modal transparent={true} visible={statusVisible}>
              <View style={{backgroundColor:'#000000aa', flex: 1, justifyContent: 'flex-end'}}>
                <TouchableOpacity onPress={()=>setStatusVisible(!statusVisible)} style={{backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, height: '35%', width: '100%', alignItems: 'center'}} >
                  
                {/* <View > */}
                  <View style={{backgroundColor: '#D9D9D9', height: '2%', width: '30%', borderRadius: 10, marginTop: '5%', marginBottom: '2%'}}></View>
                  <Text style={{fontSize: 28, fontWeight: 'bold'}}>Set Status</Text>

                  <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', backgroundColor:'#E5E9EC', width: '80%', borderRadius: 6, marginTop: '4%'}}>
                    {/* <View style={{}}> */}
                      <Image source={require('../assets/icons/online.png')} style={{marginLeft: '5%'}}/>
                      <Text style={{fontSize: 18, marginTop: '4%', marginBottom: '4%', marginLeft: '5%'}}>Online</Text>
                    {/* </View> */}
                  </TouchableOpacity>

                  <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', backgroundColor:'#E5E9EC', width: '80%', borderRadius: 6, marginTop: '2%'}}>
                    {/* <View style={{}}> */}
                      <Image source={require('../assets/icons/dnd.png')} style={{marginLeft: '5%', width: '5%'}}/>
                      <Text style={{fontSize: 18, marginTop: '4%', marginBottom: '4%', marginLeft: '5%'}}>Do Not Disturb</Text>
                    {/* </View> */}
                  </TouchableOpacity> 

                  <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', backgroundColor:'#E5E9EC', width: '80%', borderRadius: 6, marginTop: '2%'}}>
                    {/* <View style={{}}> */}
                      <Image source={require('../assets/icons/invisible.png')} style={{marginLeft: '5%'}}/>
                      <Text style={{fontSize: 18, marginTop: '4%', marginBottom: '4%', marginLeft: '5%'}}>Invisible</Text>
                    {/* </View> */}
                  </TouchableOpacity>   

                {/* </View> */}
                </TouchableOpacity>

              </View>
            </Modal>
          {/* </GestureRecognizer> */}

          <View style={{height: 1, backgroundColor: '#E9E9E9'}} />

          {/* <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <Text style={{fontSize: 20, marginTop: '2%', marginLeft: '4%', marginBottom: '2%'}}>Biography & Intro</Text>
            <Image style={{width: '15%', height: '100%', marginTop: '1%'}}source={require('../assets/arrow.png')} />
          </TouchableOpacity> */}
          
        </View>

        <View style={styles.box2}>
          
        <TouchableOpacity onPress={() => setModalVisible(true)} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <Text style={{fontSize: 20, marginTop: '2%', marginLeft: '4%'}}>Change Password</Text>
            <Image style={{width: '15%', height: '100%', marginTop: '2%'}}source={require('../assets/arrow.png')} />
          </TouchableOpacity>

          <Modal transparent={true} visible={modalVisible}>
            <View style={{backgroundColor:'#000000aa', flex: 1, justifyContent: 'flex-end'}}>
              <TouchableOpacity onPress={()=>setModalVisible(!modalVisible)} style={{backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, height: '50%', width: '100%', alignItems: 'center'}} >
              <View style={{backgroundColor: '#D9D9D9', height: '1.5%', width: '30%', borderRadius: 10, marginTop: '5%', marginBottom: '2%'}}></View>
                <Text style={{fontSize: 22, fontWeight: 800, marginTop: '2%'}}>Update Password</Text>
                <Text style={{fontSize: 13, marginTop: '2%'}}>Please enter your old password and your new password.</Text>
                <View style={{backgroundColor: '#FFFFFF',width: '80%', height: '7%', borderRadius: 5,shadowColor: 'black',shadowOpacity: 0.6, shadowOffset: {width: 2, height: 2},elevation: 8, marginTop:'10%'}}>
                  <TextInput style={{fontSize: 15, color:'#7E7E7E', marginTop: '2%', marginLeft: '2%'}} placeholder="Current Password"/>
                </View>
                <View style={{backgroundColor: '#FFFFFF',width: '80%', height: '7%', borderRadius: 5,shadowColor: 'black',shadowOpacity: 0.6, shadowOffset: {width: 2, height: 2},elevation: 8, marginTop:'10%'}}>
                  <TextInput style={{fontSize: 15, color:'#7E7E7E', marginTop: '2%', marginLeft: '2%'}} placeholder="New Password"/>
                </View>
                <TouchableOpacity style={{backgroundColor: '#000000', width: '80%', height: '10%', alignItems: 'center', justifyContent: 'center', marginTop: '15%', borderRadius: 10, shadowColor: 'black', shadowOpacity: 0.6, shadowOffset: {width: 2, height: 2},elevation: 8,}}>
                  <Text style={{color: 'white', fontSize: 21}}>Update</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          </Modal>

          <View style={{height: '1%', backgroundColor: '#E9E9E9', marginTop:'2%', marginBottom: '2%'}} />

          <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <Text style={{fontSize: 20, marginLeft: '4%', marginBottom: '1%'}}>Sign Out</Text>
            <Image style={{width: '8%', height: '100%', marginRight: '3%', marginTop: '0.5%'}}source={require('../assets/signout.png')} />
          </TouchableOpacity>
          
        </View>
        
{/* 
        <View style={styles.nav}>
            <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center'}}>
            <Image style = {{width: 45, height: 40}} source={require('../assets/home_icon.png')} />
            <Text style={{color: '#2E4851'}}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center'}}>
            <Image style = {{width: 45, height: 45}} source={require('../assets/chat_icon.png')} />
            <Text style={{color: '#2E4851'}}>Message</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center'}}>
            <Image style = {{width: 45, height: 45}} source={require('../assets/profile_sicon.png')}/>
            <Text style={{color: '#2E4851'}}>Profile</Text>
            </TouchableOpacity>
        </View>
         */}

        </SafeAreaView>
    );
  }
// }

const styles = EStyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FAFAFA',
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    img: {
      width: 100,
      height: 100,
    },
    bar: {
      height: 50,
      // alignItems: 'center',
      left: '5%',
      top: '5%',
      // justifyContent: 'center',
    },
    nav: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      backgroundColor: '#E0E0E0', 
      height: 95,
      position: 'absolute',
      bottom: '0%',
      width: '100%',
    },
    studentbtn: {
      backgroundColor: '#0AAAC0',
      width: 110,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 60,
      
    },
    tutorbtn: {
      backgroundColor: '#E5E9EC',
      width: 110,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 60,
    },
    box1: {
      backgroundColor: '#FFFFFF',
      width: '94%',
      // height: '14%',
      top: '13%',
      left: '3%',
      shadowOpacity: 0.6, 
      shadowOffset: {width: 2, height: 2},
      borderRadius: 5,
      shadowColor: 'black',
      elevation: 8,
    },
    box2: {
      backgroundColor: '#FFFFFF',
      width: '94%',
      // height: '13%',
      top: '16%',
      left: '3%',
      shadowOpacity: 0.6, 
      shadowOffset: {width: 2, height: 2},
      borderRadius: 5,
      shadowColor: 'black',
      elevation: 8,
    }
  });

export default TutorProfile;
