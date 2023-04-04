import { getDownloadURL, listAll, ref } from 'firebase/storage';
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, Dimensions, StyleSheet } from 'react-native';
import { storage } from '../firebase';
import { useDispatch, useSelector } from 'react-redux';
import { selectImages, selectUserEmails, setImages } from '../features/imagesSlice';

const windowWidth = Dimensions.get('window').width;

const UsersScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
            {Object.entries(useSelector(selectUserEmails)).map(([month, images]) => (
                <View key={month} style={styles.monthContainer}>
                    <Text style={styles.monthTitle}>{month}</Text>
                    {images.map((image, index) => (
                        <View key={index} style={styles.imageRow}>
                            <Image source={{ uri: image.url }} style={styles.image} />
                            <Text style={styles.imageAmount}>{image.amount} Лв.</Text>
                        </View>
                    ))}
                </View>
            ))}
        </ScrollView>
  )
}

const styles = StyleSheet.create({
    scrollView: {
        flexGrow: 1,
        padding: 16,
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