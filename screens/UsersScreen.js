import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  StyleSheet,
} from "react-native";
import { auth, db, storage } from "../firebase";
import { useSelector } from "react-redux";
import { selectUserEmails } from "../features/imagesSlice";
import { TouchableOpacity } from "react-native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { ActivityIndicator } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";

const UsersScreen = ({ navigation }) => {
  const userID = auth.currentUser.email;
  const [accessUsers, setAccessUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isScannerVisible, setIsScannerVisible] = useState(false);

  const handleBarCodeScanned = ({ type, data }) => {
    setIsScannerVisible(false);
    alert(`${data}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      const userAccessQuery = query(
        collection(db, "UserAccess"),
        where("ParentUser", "==", userID)
      );
      const querySnapshot = await getDocs(userAccessQuery);

      const parents = [];
      querySnapshot.forEach((doc) => {
        parents.push(doc.data().AccessUser);
      });

      setAccessUsers(parents);
    };

    fetchData();
  }, []);

  const onLayoutHandler = () => {
    setLoading(false);
  };

  const userEmails = useSelector((state) =>
    selectUserEmails(state, accessUsers)
  );

  return (
    <>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {userEmails.map((email, index) => (
          <TouchableOpacity
            key={index}
            style={styles.userContainer}
            onPress={() => navigation.navigate("Images", { email })}
            onLayout={
              index === userEmails.length - 1 ? onLayoutHandler : undefined
            }
          >
            <Text style={styles.userEmail}>{email}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {loading && (
        <View style={styles.backgroundButton}>
          <ActivityIndicator
            style={styles.activityIndicator}
            size="large"
            color="#00b3ff"
          ></ActivityIndicator>
        </View>
      )}
      <TouchableOpacity
        style={styles.floatingButtonWide}
        onPress={() => setIsScannerVisible(true)} // Navigate to QRCodeScreen
      >
        <Text style={styles.wideButtonText}>Scan QR Code</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate("ImagePicker")}
      >
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>

      {isScannerVisible && (
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  activityIndicator: {
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    position: "absolute",
  },
  backgroundButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: "#b4b4b4",
    paddingHorizontal: 20,
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  scrollView: {
    paddingTop: 50,
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#F3F3F3",
  },
  userContainer: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userEmail: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Roboto",
    color: "#424242",
  },
  floatingButtonWide: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "#2196F3",
    borderRadius: 50,
    paddingHorizontal: 20,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#2196F3",
    borderRadius: 50,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  wideButtonText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});

export default UsersScreen;
