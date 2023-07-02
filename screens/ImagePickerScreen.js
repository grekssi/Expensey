import { Alert, Dimensions, Image, Modal, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { auth, storage } from '../firebase'
import * as ImagePicker from 'expo-image-picker'
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import DateTimePicker from '@react-native-community/datetimepicker';
import { addDoc, collection, doc, getFirestore, setDoc } from 'firebase/firestore'
import * as Animatable from "react-native-animatable"
import { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import styles from '../styles'

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const ImagePickerScreen = ({ navigation }) => {
    var nav = useNavigation();

    const [pickedImage, setPickedImage] = useState(null);
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [textFieldValue, setTextFieldValue] = useState('');
    const [validationModalVisible, setValidationModalVisible] = useState(false);
    const [showImage, setShowImage] = useState(false);

    useEffect(() => {
        try {
            if (isUploading) {
                const timer = setTimeout(() => {
                    setShowImage(true);
                    nav.navigate("Users");
                }, 3000);
                return () => clearTimeout(timer); // This will clear Timeout when component unmounts.
            } else {
                setShowImage(false); // When not uploading, don't show the secondary image
            }
        } catch (error) {
            console.log(error);
        }
    }, [isUploading, nav]); // Ensure 'nav' is in your dependency array.

    // State for storing the entered number
    const [enteredNumber, setEnteredNumber] = useState(null);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
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

    const addNewDocument = async (email, date, amount, imageUrl, isPaid) => {
        const db = getFirestore();

        const newDocument = {
            Email: email,
            Date: date,
            Amount: amount,
            ImageUrl: imageUrl,
            IsPaid: isPaid,
            IsDeleted: false
        };

        try {
            const docRef = await addDoc(collection(db, "UserImages"), newDocument);
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    const getCurrentDate = (dateToFormat) => {
        const month = dateToFormat.getMonth() + 1; // getMonth() is zero-based
        const year = dateToFormat.getFullYear();

        return `${month < 10 ? '0' : ''}${month}/${year}`; // padding zero if month < 10
    };

    const getTextFromImage = (imageUrl) => {
        var myHeaders = new Headers();
        myHeaders.append("apikey", "5oSPT6ti9JJg0OI5fnUpncoRyhP1faZS");

        var requestOptions = {
            method: 'GET',
            redirect: 'follow',
            headers: myHeaders
        };

        console.log(imageUrl);

        fetch(imageUrl, requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }


    const uploadImageToFirebase = async () => {
        try {

            if (enteredNumber === null || pickedImage === null) {
                setValidationModalVisible(true);
                return;
            }

            setIsUploading(true);

            const response = await fetch(pickedImage);
            const blob = await response.blob();
            const storageRef = ref(storage, `images/${Date.now() + '_' + Math.floor(Math.random() * Math.floor(1000))}`);
            const uploadTask = uploadBytesResumable(storageRef, blob);

            const downloadURL = await new Promise((resolve, reject) => {
                uploadTask.on('state_changed',
                    (snapshot) => {
                        // You can add a progress indicator here if you want
                    },
                    (error) => {
                        console.error('Error fetching downloadURL', error);
                        reject(error);
                    },
                    async () => {
                        const url = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve(url);
                    }
                );
            });

            var date2 = getCurrentDate(date);

            addNewDocument(auth?.currentUser.email, date2, enteredNumber, downloadURL, "none");

        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    const handleSubmit = () => {
        const inputNumber = parseFloat(textFieldValue);
        if (inputNumber <= 99.99) {
            setEnteredNumber(inputNumber.toFixed(2));
            setTextFieldValue('');
            setModalVisible(false);
        } else {
            Alert.alert('Invalid Amount', 'Please enter an amount not larger than 99.99lv');
        }
    };

    return (
        <View style={styles.ImagePicker.scrollViewContainer}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.ImagePicker.overlay} />
                <View style={styles.ImagePicker.modalView}>
                    <Text style={styles.ImagePicker.modalTitle}>Enter a Number</Text>
                    <TextInput
                        style={styles.ImagePicker.textInput}
                        onChangeText={(text) => setTextFieldValue(text)}
                        value={textFieldValue}
                        keyboardType="numeric"
                        placeholder="Enter number"
                        maxLength={5}
                    />
                    <TouchableOpacity
                        style={styles.ImagePicker.submitButton}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.ImagePicker.submitButtonText}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            <View>
                <View className="flex-col">
                    <View style={styles.ImagePicker.imageContainer}>
                        {pickedImage && (
                            <Image
                                source={{ uri: pickedImage }}
                                style={{ width: 350, height: 350 }}
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



                </View>
            </View>

            {!isUploading && (
                <View className="flex-col space-y-3 items-center mb-5">
                    <View style={styles.ImagePicker.monthContainer}>
                        <View style={styles.ImagePicker.imageRow}>
                            <Text className="text-lg font-bold text-gray-700">Date : {monthNames[date.getMonth()]} {date.getFullYear()}</Text>
                        </View>
                        <View style={styles.ImagePicker.imageRow}>
                            <Text className="text-lg font-bold text-gray-700">Amount : {enteredNumber}lv</Text>
                        </View>
                    </View>

                    <TouchableOpacity onPress={pickImage} style={styles.ImagePicker.buttonContainer}>
                        <Text className=" text-lg font-bold text-gray-700">Pick Image</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={showPicker} style={styles.ImagePicker.buttonContainer}>
                        <Text className=" text-lg font-bold text-gray-700">Pick Date</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={showModal} style={styles.ImagePicker.buttonContainer}>
                        <Text className=" text-lg font-bold text-gray-700">Pick Amount</Text>
                    </TouchableOpacity>


                    <View className="mx-10 mt-10">
                        <TouchableOpacity onPress={uploadImageToFirebase} className="bg-gray-600 p-4 w-80 rounded-3xl">
                            <Text style={styles.ImagePicker.buttonText}>Send</Text>
                        </TouchableOpacity>
                    </View>
                </View>)}

            {isUploading && !showImage && (
                <View className="items-center">
                    <View className="align-middle self-center">
                        <Animatable.Image
                            source={require("../assets/loading.gif")}
                            animation="slideInUp"
                            iterationCount={1}
                            className="h-96 w-96" />
                    </View>
                </View>
            )}

            <Modal
                animationType="fade"
                transparent={true}
                statusBarTranslucent={true}
                visible={validationModalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                }}>
                <View style={styles.ImagePicker.centeredView}>
                    <View style={styles.ImagePicker.validationModalView}>
                        <Text style={styles.ImagePicker.modalText}>Both image and amount must be filled!</Text>
                        <TouchableHighlight
                            style={{ ...styles.ImagePicker.openButton, backgroundColor: '#2196F3' }}
                            onPress={() => {
                                setValidationModalVisible(!validationModalVisible);
                            }}>
                            <Text style={styles.ImagePicker.textStyle}>Hide</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default ImagePickerScreen
