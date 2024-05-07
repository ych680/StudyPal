import React from 'react';
import { StyleSheet, SafeAreaView, View, Image, TouchableOpacity, Text, StatusBar, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, TextInput} from 'react-native';
import { useNavigation } from '@react-navigation/native';


  
function IncorrectLogin(props) {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.bar}>
                <Image  style = {{width: 40, height: 40, top: '5%'}} source={require('../assets/icons/slim-arrow.png')}/>
                <Text style={{fontSize: 40, fontFamily: 'Inter', fontWeight: 'bold', paddingTop: 10}}> Login</Text>
            </View>

            <View style={styles.body}>
                <TouchableOpacity style={{backgroundColor: 'white', flexDirection: 'row', height: '21%', justifyContent: 'space-evenly', alignItems: 'center', borderRadius: 20, shadowColor: 'black', shadowOpacity: 0.9, elevation: 8}} onPress={() => navigation.navigate('StudentHome')}>
                    <Image style={{height: 40, width: 40}} source={require('../assets/icons/google.png')}/>
                    <Text style={{fontSize: 18, fontWeight: '500'}}>Login with Google         </Text>
                    <Image style={{height: 22, width: 35.5}} source={require('../assets/icons/long-arrow.png')}/>
                </TouchableOpacity>

                <Text style={{fontSize: 16, fontWeight: '500', paddingTop: 30, paddingBottom: 10, paddingLeft: 20, color:'red'}}>Email Address</Text>

                <View style={{backgroundColor: 'white', flexDirection: 'row', height: '21%', justifyContent: 'flex-start', alignItems: 'center', borderRadius: 20, shadowColor: 'black', shadowOpacity: 0.9, elevation: 8, borderColor:'red', borderWidth: 2}}>
                    <Image style={{height: 30, width: 38.7, marginLeft: 15}} source={require('../assets/icons/redemail.png')}/>
                    {/* <Text style={{color:'#7E7E7E', fontSize: 18, fontWeight: '400'}}>Email Address         </Text> */}
                    <KeyboardAvoidingView >
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={styles.inner}>
                                <TextInput placeholder="Email Address" style={styles.textInput} />
                            </View>
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                </View>

                <Text style={{fontSize: 16, fontWeight: '500', paddingTop: 30, paddingBottom: 10, paddingLeft: 20,color:'red'}}>Password</Text>

                <View style={{backgroundColor: 'white', flexDirection: 'row', height: '21%', justifyContent: 'flex-start', alignItems: 'center', borderRadius: 20, shadowColor: 'black', shadowOpacity: 0.9, elevation: 8,borderWidth:2,borderColor:'red'}}>
                    <Image style={{height: 35, width: 33, marginLeft: 15}} source={require('../assets/icons/redlock.png')}/>
                    {/* <Text style={{color:'#7E7E7E', fontSize: 18, fontWeight: '400'}}>Email Address         </Text> */}
                    <KeyboardAvoidingView >
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={styles.inner}>
                                <TextInput placeholder="Password" style={styles.textInput} />
                            </View>
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                </View>

                <Text style={{fontSize: 16, fontWeight: '500', paddingTop: 30, paddingBottom: 10, paddingLeft: 20,color:'red'}}>* Invalid email address or password</Text>

            </View>

            <TouchableOpacity style={{backgroundColor: 'black', top: '35%', width: '80%', height: '7%', left: '10%', alignItems: 'center', justifyContent: 'center', borderRadius: 20, shadowColor:'black', shadowOpacity: 0.9, elevation: 8}} onPress={() => navigation.navigate('StudentHome')}>
                <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>Login</Text>
            </TouchableOpacity>
        </SafeAreaView>

    )
} 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        },
    bar: {
        height: '10%',
        left: '5%',
        top: '5%',
    },
    body: {
        height: '40%',
        top: '17%',
        width: '80%',
        left: '10%',
    },
    inner: {
        padding: 20,
        flex: 1,
        justifyContent: 'space-around',
      },
      header: {
        fontSize: 36,
        marginBottom: 48,
      },
      textInput: {
        color:'#7E7E7E', 
        fontSize: 18, 
        fontWeight: '400'
      },
      btnContainer: {
        backgroundColor: 'white',
        marginTop: 12,
      },
});

export default IncorrectLogin;

