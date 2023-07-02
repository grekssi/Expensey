import { KeyboardAvoidingView, StyleSheet, View } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Input } from 'react-native-elements/dist/input/Input'
import { Button, Text } from 'react-native-elements'
import { auth } from '../firebase'
import { createUserWithEmailAndPassword, updateCurrentUser } from 'firebase/auth'
import { updateProfile } from 'firebase/auth'
import styles from '../styles'

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
                    photoURL: "",
                });
            }).catch((error) => alert(error.message))

    };

    return (
        <KeyboardAvoidingView style={styles.Register.container}>
            <StatusBar style='light' />

            <Text h3 style={{ marginBottom: 50 }}>Create an Expensey account</Text>

            <View style={styles.Register.inputContainer}>
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

            <Button containerStyle={styles.Register.button} raised onPress={register} title="Register" />
        </KeyboardAvoidingView>
    )
}

export default RegisterScreen