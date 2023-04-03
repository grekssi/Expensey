import { getDownloadURL, listAll, ref } from 'firebase/storage';
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, Dimensions } from 'react-native';
import { storage } from '../firebase';

const windowWidth = Dimensions.get('window').width;

const ImagesScreen = () => {

    const [imagesByMonth, setImagesByMonth] = useState({});

    useEffect(() => {
        fetchImages();
    }, []);

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
                const month = parseInt(dataArray[1], 10);
                const year = parseInt(dataArray[2], 10);
                const amount = parseFloat(dataArray[3]);

                console.log(`Email: ${email}`);
                console.log(`Month: ${month}`);
                console.log(`Year: ${year}`);
                console.log(`Amount: ${amount}`);

                if (!urlsByMonth[month]) {
                    urlsByMonth[month] = [];
                }
                urlsByMonth[month].push(url);
            }

            setImagesByMonth(urlsByMonth);
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    return (
        <ScrollView>
            {Object.entries(imagesByMonth).map(([month, urls]) => (
                <View key={month}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{month}</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {urls.map((url, index) => (
                            <Image
                                key={index}
                                source={{ uri: url }}
                                style={{
                                    width: windowWidth / 3,
                                    height: windowWidth / 3,
                                }}
                            />
                        ))}
                    </View>
                </View>
            ))}
        </ScrollView>
    );
};

export default ImagesScreen;
