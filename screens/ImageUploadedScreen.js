import { View, Text } from 'react-native'
import React from 'react'
import { Image } from 'react-native'

const ImageUploadedScreen = () => {
  return (
    <View className="flex-1">
      <Image
          source={require("../assets/uploaded.png")}
          style={{ width: 200, height: 200, marginTop: 20 }}
          resizeMode="contain"
        />
    </View>
  )
}

export default ImageUploadedScreen