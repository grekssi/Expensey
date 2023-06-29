import { KeyboardAvoidingView, StyleSheet, View } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Input } from 'react-native-elements/dist/input/Input'
import { Button, Text } from 'react-native-elements'
import { auth } from '../firebase'
import { createUserWithEmailAndPassword, updateCurrentUser } from 'firebase/auth'
import { updateProfile } from 'firebase/auth'

const RegisterScreen = ({ navigation }) => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitle: "Back To Login"
        });
    }, [navigation])

    const register = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((authUser) => {
                updateProfile(auth?.currentUser, {
                    displayName: name,
                    photoURL: "https://seeklogo.com/images/S/signal-logo-20A1616F60-seeklogo.com.png",
                });
            }).catch((error) => alert(error.message))

    };

    return (
        <KeyboardAvoidingView style={styles.container}>
            <StatusBar style='light' />

            <Text h3 style={{ marginBottom: 50 }}>Create a Signal account</Text>

            <View style={styles.inputContainer}>
                <Input
                    placeholder='Full Name'
                    type="text"
                    value={name}
                    onChangeText={(text) => setName(text)} />

                <Input
                    placeholder='Email'
                    type="email"
                    value={email}
                    onChangeText={(text) => setEmail(text)} />

                <Input
                    placeholder='Password'
                    type="password"
                    secureTextEntry
                    value={password}
                    onChangeText={(text) => setPassword(text)} />

                <Input
                    placeholder='Profile Picture URL (Optional)'
                    type="imageUrl"
                    value={imageUrl}
                    onChangeText={(text) => setImageUrl(text)}
                    onSubmitEditing={register} />
            </View>

            <Button containerStyle={styles.button} raised onPress={register} title="Register" />
        </KeyboardAvoidingView>
    )
}

export default RegisterScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        backgroundColor: "white"
    },
    button: {
        width: 200,
        marginTop: 10
    },
    inputContainer: {
        width: 300
    },

})