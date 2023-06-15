import { Alert, Dimensions, Image, Modal, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { ScrollView } from 'react-native'
import { auth, storage } from '../firebase'
import * as ImagePicker from 'expo-image-picker'
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import DateTimePicker from '@react-native-community/datetimepicker';
import { addDoc, collection, doc, getFirestore, setDoc } from 'firebase/firestore'
import * as Animatable from "react-native-animatable"
import { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
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
            IsPaid: isPaid
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
                        console.error('Error uploading image:', error);
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
        <View style={styles.scrollViewContainer}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.overlay} />
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Enter a Number</Text>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={(text) => setTextFieldValue(text)}
                        value={textFieldValue}
                        keyboardType="numeric"
                        placeholder="Enter number"
                        maxLength={5}
                    />
                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.submitButtonText}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            <View>
                <View className="flex-col">
                    <View style={styles.imageContainer}>
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
                    <View style={styles.monthContainer}>
                        <View style={styles.imageRow}>
                            <Text className="text-lg font-bold text-gray-700">Date : {monthNames[date.getMonth()]} {date.getFullYear()}</Text>
                        </View>
                        <View style={styles.imageRow}>
                            <Text className="text-lg font-bold text-gray-700">Amount : {enteredNumber}lv</Text>
                        </View>
                    </View>

                    <TouchableOpacity onPress={pickImage} style={styles.buttonContainer}>
                        <Text className=" text-lg font-bold text-gray-700">Pick Image</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={showPicker} style={styles.buttonContainer}>
                        <Text className=" text-lg font-bold text-gray-700">Pick Date</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={showModal} style={styles.buttonContainer}>
                        <Text className=" text-lg font-bold text-gray-700">Pick Amount</Text>
                    </TouchableOpacity>


                    <View className="mx-10 mt-10">
                        <TouchableOpacity onPress={uploadImageToFirebase} className="bg-gray-600 p-4 w-80 rounded-3xl">
                            <Text style={styles.buttonText}>Send</Text>
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
                <View style={styles.centeredView}>
                    <View style={styles.validationModalView}>
                        <Text style={styles.modalText}>Both image and amount must be filled!</Text>

                        <TouchableHighlight
                            style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
                            onPress={() => {
                                setValidationModalVisible(!validationModalVisible);
                            }}>
                            <Text style={styles.textStyle}>Hide</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    validationModalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    imageContainer: {
        alignSelf: 'center',
        height: windowHeight * 0.3,
    },
    scrollViewContainer: {
        flex: 1,
        flexDirection: 'column',
        height: windowHeight,
        backgroundColor: '#F1F1F1',
        justifyContent: 'space-between'
    },
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
    textInput: {
        borderWidth: 1,
        borderColor: 'gray',
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginBottom: 15,
    },
    result: {
        marginTop: 20,
        fontSize: 18,
    },
    button: {
        width: 300,
        backgroundColor: 'gray',
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
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        position: 'absolute',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        alignSelf: 'center',
        width: '80%',
        marginTop: '50%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 24,
        marginBottom: 15,
        fontWeight: 'bold',
    },
    textInput: {
        borderWidth: 1,
        borderColor: 'gray',
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginBottom: 15,
        borderRadius: 5,
    },
    submitButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        height: 0,
        width: 80,
        backgroundColor: '#2196F3',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 18,
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: "center",
        marginHorizontal: 30,
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        padding: 10,
        width: windowWidth * 0.9,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    monthContainer: {
        alignSelf: 'center',
        flexDirection: 'column',
        width: windowWidth * 0.9,
        gap: 7,
        justifyContent: 'center',
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    imageRow: {
        width: windowWidth * 0.7, // 50% of the window width
        flexDirection: "row",
        alignItems: "center",
        padding: 4,
        backgroundColor: "#F8F8F8",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#E0E0E0",
    },
    image: {
        width: windowWidth * 0.9, // 90% of the window width
        height: windowHeight * 0.4, // 40% of the window height
    },

    openButton: {
        width: 100,
        backgroundColor: '#2196F3',
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        fontSize: 20,
        marginBottom: 15,
        textAlign: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        backgroundColor: "rgba(0,0,0,0.5)" // this is the grayed-out background
    },
});

export default ImagePickerScreen
