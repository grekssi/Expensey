import { getDownloadURL, listAll, ref } from "firebase/storage";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  StyleSheet,
} from "react-native";
import { storage } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import {
  selectImages,
  selectImagesByEmail,
  setImages,
} from "../features/imagesSlice";

const windowWidth = Dimensions.get("window").width;

const getTotalAmount = (images) => {
  return images.reduce((total, image) => total + image.amount, 0);
};

const ImagesScreen = ({ route, navigation }) => {
  const email = route.params.email;

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      {Object.entries(
        useSelector((state) => selectImagesByEmail(state, email))
      ).map(([month, images]) => (
        <View key={month} style={styles.monthContainer}>
          <Text style={styles.monthTitle}>
            {month} - {getTotalAmount(images)} Лв.
          </Text>
          {images.map((image, index) => (
            <View key={index} style={styles.imageRow}>
              <Image source={{ uri: image.url }} style={styles.image} />
              <Text style={styles.imageAmount}>{image.amount} Лв.</Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#F3F3F3",
  },
  monthContainer: {
    alignItems: "center",
    marginBottom: 24,
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
  monthTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    fontFamily: "Roboto",
    color: "#424242",
  },
  imageRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    width: "100%",
    padding: 8,
    backgroundColor: "#F8F8F8",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  image: {
    width: windowWidth / 3,
    height: windowWidth / 3,
    resizeMode: "cover",
    borderRadius: 10,
  },
  imageAmount: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Roboto",
    color: "#424242",
  },
});

export default ImagesScreen;
