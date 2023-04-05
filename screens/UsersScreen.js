import { getDownloadURL, listAll, ref } from 'firebase/storage';
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, Dimensions, StyleSheet } from 'react-native';
import { storage } from '../firebase';
import { useDispatch, useSelector } from 'react-redux';
import { selectImages, selectUserEmails, setImages } from '../features/imagesSlice';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;

const UsersScreen = () => {
    const navigation = useNavigation();

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            {Object.entries(useSelector(selectUserEmails)).map(([month, images]) => (
                <TouchableOpacity key={month} style={styles.monthContainer}>
                    <Text style={styles.monthTitle} onPress={() => navigation.navigate("Images", { email: images })} className="bg-gray-200 p-4">{images}</Text>
                </TouchableOpacity>
            ))}

            <TouchableOpacity onPress={() => navigation.navigate("ImagePicker")} className="mx-24 p-5 bg-black rounded-full items-center bottom-0">
                <Text className="text-white text-xl font-bold">Select Image</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        flexGrow: 1,
        marginTop: 16
    },
    monthContainer: {
        marginBottom: 24,
    },
    monthTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    imageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    image: {
        width: windowWidth / 3,
        height: windowWidth / 3,
        marginRight: 16,
    },
    imageAmount: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default UsersScreen