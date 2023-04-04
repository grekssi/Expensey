import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { Image } from 'react-native'
import * as Animatable from "react-native-animatable"

const ImageUploadedScreen = () => {

  return (
    <View className="flex-1 bg-gray-100 items-center">
      <Animatable.Image
        source={require("../assets/loadingDone.png")}
        iterationCount={1}
        className="h-60 w-60 mt-16" />

        <Text className="text-3xl font-bold text-blue-500 mt-36">
          Uploaded
        </Text>
    </View>
  )
}

export default ImageUploadedScreen