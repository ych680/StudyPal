import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, StatusBar, Platform } from 'react-native';
import ContinueButton from './assets/continue.svg';

const VerifyScreen = ({ route }) => {
  const navigation = useNavigation();
  const { name, email, password } = route.params;
  // console.log(name, email, password);

  return (
    <SafeAreaView style={styles.container}>
        <Text style={styles.headerText}>Verify</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("Role", {name: name, email: email, password: password})}>
            <ContinueButton
              style={styles.continueButton}/>
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
    marginLeft: 31,
    marginTop: Platform.OS === 'android' ? '11%' : 0, 
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: '10%',
  },
  continueButton: {
    alignSelf: 'center',
  },
})

export default VerifyScreen;
