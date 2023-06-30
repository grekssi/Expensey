import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { SafeAreaView } from 'react-native'
import { ScrollView } from 'react-native'
import CustomListItem from '../components/CustomListItem'
import { Avatar, Button } from 'react-native-elements'
import { auth, storage } from '../firebase'
import * as ImagePicker from 'expo-image-picker'
import mime from 'mime'
import { getStorage, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";


const HomeScreen = ({ navigation }) => {

    const [pickedImage, setPickedImage] = useState(null);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            // Upload the image to Firebase Storage
            setPickedImage(result.assets[0].uri);
        }
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Signal",
            headerStyle: { backgroundColor: "#fff" },
            headerTitleStyle: { color: "black" },
            headerTintColor: "black",
            headerLeft: () => (
                <View style={{ marginLeft: 20 }}>
                    <TouchableOpacity onPress={pickImage}>
                        <Avatar rounded source={{ uri: auth?.currentUser?.photoURL }} />
                    </TouchableOpacity>
                </View>
            )
        })
    }, [])

    return (
        <SafeAreaView>
            <ScrollView>
                <CustomListItem />
                <View className='top-52'>
                    {pickedImage && (
                        <Image
                            source={{ uri: pickedImage }}
                            style={{ width: 200, height: 200, marginTop: 20 }}
                            resizeMode="contain"
                        />
                    )}
                </View>
            </ScrollView>
            <Button title="Pick an image" onPress={pickImage}/>
        </SafeAreaView>
    )
}

export default HomeScreen
