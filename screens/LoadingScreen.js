import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import * as Animatable from "react-native-animatable"
import { useNavigation } from '@react-navigation/native';


const LoadingScreen = () => {
    const navigation = useNavigation();

    useEffect(() => {
        setTimeout(() => {
            navigation.navigate("ImageUploaded")
        }, 3000)
    })

    return (
        <View className="items-center">
            <View className="absolute flex-1 bg-gray-100 items-center">
                <Animatable.Image
                    source={require("../assets/loading.gif")}
                    animation="slideInUp"
                    iterationCount={1}
                    className="h-96 w-96" />
            </View>
        </View>
    )
}

export default LoadingScreen