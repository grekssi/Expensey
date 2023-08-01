import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import styles from '../styles';

const ExpenseItem = ({ month, images, handleLongPress, selectedImages, setFooterVisible, setModalImage, setModalVisible }) => {
  const getTotalAmount = (images) => {
    return images.reduce((total, image) => total + image.amount, 0);
  };

  return (
    <View key={month} style={styles.Images.monthContainer}>
      <Text style={styles.Images.monthTitle}>
        {month} - {getTotalAmount(images)} Лв.
      </Text>
      {images.map((image, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleLongPress(image, month, index)}
          style={[
            styles.Images.imageRow,
            selectedImages.some(selectedImage => selectedImage.url === image.url)
              ? { backgroundColor: "darkgray" }
              : image.IsPaid === "paid"
                ? { backgroundColor: "rgba(56,209,0,0.6)" }
                : image.IsPaid === "unpaid"
                  ? {}
                  : {}
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              setFooterVisible(true);
              setModalImage([{ url: image.url }]);
              setModalVisible(true);
            }}
          >
            <Image source={{ uri: image.url }} style={styles.Images.image} />
          </TouchableOpacity>
          <Text style={styles.Images.imageAmount}>{image.amount} Лв.</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ExpenseItem;
