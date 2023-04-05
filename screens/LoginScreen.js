import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Button, Input, Image } from 'react-native-elements'
import { StatusBar } from 'expo-status-bar'
import { KeyboardAvoidingView } from 'react-native'
import { auth, storage } from '../firebase'
import { onAuthStateChanged, setPersistence, signInWithEmailAndPassword, browserLocalPersistence, inMemoryPersistence, indexedDBLocalPersistence } from 'firebase/auth'
import { useDispatch, useSelector } from 'react-redux'
import { getDownloadURL, listAll, ref } from 'firebase/storage'
import { selectImages, selectUserEmails, setImages } from '../features/imagesSlice'

const LoginScreen = ({ navigation }) => {

    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signIn = () => {
        signInWithEmailAndPassword(auth, email, password)
            .catch((error) => alert(error));

        fetchImages();
    }

    const fetchImages = async () => {
        try {
            const imageFolderRef = ref(storage, 'images');
            const imageList = await listAll(imageFolderRef);
            const urlsByMonth = {};

            for (const imageRef of imageList.items) {
                const url = await getDownloadURL(imageRef);
                // const month = imageRef.name.slice(0, 7);

                const dataArray = imageRef.name.split(":");

                const email = dataArray[0];
                const year = parseInt(dataArray[2], 10);
                const month = parseInt(dataArray[1], 10).toString() + "/" + year.toString();
                const amount = parseFloat(dataArray[3]);

                if (!urlsByMonth[month]) {
                    urlsByMonth[month] = [];
                }

                var obj = 
                {
                    email: email,
                    month: month,
                    year: year,
                    amount: amount,
                    url: url,
                }

                urlsByMonth[month].push(obj);
            }
            dispatch(setImages(urlsByMonth));
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Login",
            headerTitleAlign: 'center'
        });
    }, [navigation])

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            if (authUser) {
                navigation.replace("Users")
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
                    onSubmitEditing={signIn} />
            </View>

            <Button containerStyle={styles.button} onPress={signIn} title='Login' />
            <Button containerStyle={styles.button} onPress={() => navigation.navigate("Register")} type="outline" title='Register' />

        </KeyboardAvoidingView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        backgroundColor: "white"
    },
    inputContainer: {
        width: 300,

    },
    button: {
        width: 200,
        marginTop: 10,
    }
})