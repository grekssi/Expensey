import { Alert, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { SafeAreaView } from 'react-native'
import { ScrollView } from 'react-native'
import CustomListItem from '../components/CustomListItem'
import { Avatar, Button } from 'react-native-elements'
import { auth, storage } from '../firebase'
import * as ImagePicker from 'expo-image-picker'
import mime from 'mime'
import { getStorage, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import DateTimePicker from '@react-native-community/datetimepicker';
import { StackView } from '@react-navigation/stack'
import * as Animatable from "react-native-animatable"


const ImagePickerScreen = ({ navigation }) => {

    const [pickedImage, setPickedImage] = useState(null);
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [textFieldValue, setTextFieldValue] = useState('');

    // State for storing the entered number
    const [enteredNumber, setEnteredNumber] = useState(null);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
        console.log(date);
    };

    const showModal = () => {
        setModalVisible(true);
    };

    const showPicker = () => {
        setShowDatePicker(true);
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setPickedImage(result.assets[0].uri);
        }
    };

    const uploadImageToFirebase = async () => {
        try {
            const response = await fetch(pickedImage);
            const blob = await response.blob();
            const filename = `${auth?.currentUser.email}:${date.getMonth() + 1}:${date.getFullYear()}:${enteredNumber}` + '.jpg'; // You can customize the file name here
            const storageRef = ref(storage, `images/${filename}`);
            const uploadTask = uploadBytesResumable(storageRef, blob);

            navigation.navigate("Loading");
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    // You can add a progress indicator here if you want
                },
                (error) => {
                    console.error('Error uploading image:', error);
                },
                async () => {
                }
            );
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    const handleSubmit = () => {
        setEnteredNumber(textFieldValue);
        setTextFieldValue('');
        setModalVisible(false);
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
        <ScrollView className="flex-col space-y-4">
            <View>
                <View className="items-center h-96">
                    {pickedImage && (
                        <Image
                            source={{ uri: pickedImage }}
                            style={{ width: 400, height: 400 }}
                            resizeMode="contain"
                        />
                    )}
                </View>

                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={onChange}
                    />)}

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Enter a Number</Text>
                        <TextInput
                            style={styles.textInput}
                            onChangeText={(text) => setTextFieldValue(text)}
                            value={textFieldValue}
                            keyboardType="numeric"
                            placeholder="Enter number"
                        />
                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleSubmit}
                        >
                            <Text style={styles.submitButtonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>

                <View className="flex-row space-x-16 justify-center mt-10">
                    <Text className="text-xl font-bold">Date : {date.getMonth() + 1}/{date.getFullYear()}</Text>
                    <Text className="text-xl font-bold">Amount : {enteredNumber}lv</Text>

                </View>

                <View className="mt-10 flex-col space-y-5">

                    <TouchableOpacity onPress={pickImage} className="h-10 flex-1 items-center justify-center bg-gray-800 rounded-full mx-20">
                        <Text className=" text-lg font-bold text-white">Pick Image</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={showPicker} className="h-10 flex-1 items-center justify-center bg-gray-800 rounded-full mx-20">
                        <Text className=" text-lg font-bold text-white">Pick Date</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={showModal} className="h-10 flex-1 items-center justify-center bg-gray-800 rounded-full mx-20">
                        <Text className=" text-lg font-bold text-white">Pick Amount</Text>
                    </TouchableOpacity>


                    <View className="mx-10 mt-10">
                        <TouchableOpacity onPress={uploadImageToFirebase} style={styles.button}>
                            <Text style={styles.buttonText}>Send</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>




            <View className="absolute h-max w-max left-0 right-0 bg-black">

            </View>


        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    openModalButton: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
    },
    openModalButtonText: {
        color: 'white',
        fontSize: 18,
    },
    modalView: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 5,
        alignItems: 'center',
        alignSelf: 'center',
        width: '80%',
        marginTop: '50%',
    },
    modalTitle: {
        fontSize: 24,
        marginBottom: 15,
    },
    textInput: {
        borderWidth: 1,
        borderColor: 'gray',
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginBottom: 15,
    },
    submitButton: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 18,
    },
    result: {
        marginTop: 20,
        fontSize: 18,
    },
    button: {
        width: '100%',
        backgroundColor: 'black',
        height: 56,
        borderRadius: 9999,
        justifyContent: 'center',
    },
    buttonText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 24,
        color: 'white',
    },
});

export default ImagePickerScreen
