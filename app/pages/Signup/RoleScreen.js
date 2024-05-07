import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, Button, SafeAreaView, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { Notifier, Easing } from 'react-native-notifier';

import StudentRole from './assets/student-role.svg';
import TutorRole from './assets/tutor-role.svg';
import ContinueButton from './assets/continue.svg';

const RoleScreen = ({ route }) => {
  let name, email, password;
  if (route.params !== null) {
    name = route.params.name;
    email = route.params.email;
    password = route.params.password;
  }
  // console.log(name, email, password);
  const navigation = useNavigation();
  const [selectedRole, setSelectedRole] = useState(null);

  const continueHandler = () => {
    if (selectedRole) {
      navigation.navigate("Details", {name: name, email: email, password: password || "", role: selectedRole});
    }else{
      // notification if role not selected
      Notifier.showNotification({
        title: 'Error',
        description: 'You need to select a role!',
        duration: 3000,
        showAnimationDuration: 800,
        showEasing: Easing.bounce,
        onHidden: () => console.log('Hidden'),
        onPress: () => console.log('Press'),
        hideOnPress: false,
        translucentStatusBar: true,
        componentProps: {
          titleStyle: { color: 'red' }
        },
      });
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>Your Role</Text>
      <View style={styles.headerlessContainer}>
        <View style={styles.roleContainer}>
          <TouchableOpacity onPress={() => setSelectedRole('student')} style={selectedRole === 'student' ? styles.selected : null}>
            <StudentRole style={selectedRole === 'student' ? styles.highlighted : null} />
          </TouchableOpacity>
          <View style={{ height: '2.37%' }} />  
          <TouchableOpacity onPress={() => setSelectedRole('tutor')} style={selectedRole === 'tutor' ? styles.selected : null}>
            <TutorRole style={selectedRole === 'tutor' ? styles.highlighted : null} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={continueHandler} style={styles.continueButton}>
          <ContinueButton />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerText: {
    flexShrink: 0,
    color: '#000',
    fontFamily: 'Inter-Bold', 
    fontSize: 32, 
    fontWeight: '700', // legacy of font style from figma, unnecessary but will keep for context
    marginLeft: '7.9%',
    marginTop: Platform.OS === 'android' ? '11%' : 0,
  },
  headerlessContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButton: {
    position: 'absolute',
    bottom: '5%',
  },
  roleContainer: {
    marginBottom: '20%', // Added marginTop to make the roleContainer a little higher
  },
  highlighted: {
    opacity: 0.7,
  },
  selected: {
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 10, // Added borderRadius to make borders round
  },
}) 

export default RoleScreen;


