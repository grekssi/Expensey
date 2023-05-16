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
        <ScrollView style={styles.scrollViewContainer}>
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
                <View className="items-center h-96">
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


                <View style={styles.monthContainer}>
                    <View style={styles.imageRow}>
                        <Text className="text-xl font-bold text-gray-700">Date : {date.getMonth() + 1}/{date.getFullYear()}</Text>
                    </View>
                    <View style={styles.imageRow}>
                        <Text className="text-xl font-bold text-gray-700">Amount : {enteredNumber}lv</Text>
                    </View>

                </View>

                <View className="mt-10 flex-col space-y-5 items-center">

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
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollViewContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#F1F1F1',
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
        width: 200,
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
        flexDirection: 'row',
        gap: 30,
        justifyContent: 'center',
        alignItems: "center",
        marginHorizontal: 30,
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        padding: 16,
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
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 11,
        backgroundColor: "#F8F8F8",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#E0E0E0",
    },
});

export default ImagePickerScreen
