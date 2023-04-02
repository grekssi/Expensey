import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Button, Input, Image } from 'react-native-elements'
import { StatusBar } from 'expo-status-bar'
import { KeyboardAvoidingView } from 'react-native'
import { auth } from '../firebase'
import { onAuthStateChanged, setPersistence, signInWithEmailAndPassword, browserLocalPersistence, inMemoryPersistence, indexedDBLocalPersistence } from 'firebase/auth'

const LoginScreen = ({navigation}) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signIn = () => {
        signInWithEmailAndPassword(auth, email, password)
            .catch((error) => alert(error));
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            title:"Login",
            headerTitleAlign: 'center'
        });
    }, [navigation])

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth ,(authUser) => {
            if(authUser){
                navigation.replace("ImagePicker")
            }
        })

        return unsubscribe;
    })

    return (
        <KeyboardAvoidingView style={styles.container}>
            <StatusBar style='light' />
            <Image source={{
                uri: "https://seeklogo.com/images/S/signal-logo-20A1616F60-seeklogo.com.png"
            }}
                style={{ width: 180, height: 180 }} />

            <View style={styles.inputContainer}>
                <Input
                    placeholder='Email'
                    
                    type="email"
                    value={email}
                    onChangeText={(text) => setEmail(text)} />
                <Input
                    placeholder='Password'
                    secureTextEntry
                    type="password"
                    value={password}
                    onChangeText={(text) => setPassword(text)} 
                    onSubmitEditing={signIn}/>
            </View>

            <Button containerStyle={styles.button} onPress={signIn} title='Login'/>
            <Button containerStyle={styles.button} onPress={() =>navigation.navigate("Register")} type="outline" title='Register'/>
        </KeyboardAvoidingView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        backgroundColor: "white"
    },
    inputContainer: {
        width: 300,
        
    },
    button:{
        width: 200,
        marginTop: 10,
    }
})