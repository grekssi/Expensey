import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  StyleSheet,
  Modal,
  Button,
} from "react-native";
import { auth, db, storage } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { TouchableOpacity } from "react-native";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { ActivityIndicator } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import QRCode from "react-native-qrcode-svg";
import { Camera } from 'expo-camera';
import { getEmails, setEmails } from "../features/emailsSlice";
import EmailItem from "../components/EmailItem";
import ApiFetcher from "../features/ApiFetcher";
import { useFocusEffect } from "@react-navigation/native";
import styles from "../styles";

const windowWidth = Dimensions.get('window').width;

const UsersScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const userID = auth?.currentUser?.email;
  const emails = useSelector((state) => getEmails(state));

  const [loading, setLoading] = useState(true);
  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const [isvisible, setIsvisible] = useState(false);
  const [jwtToken, setJwtToken] = useState("");
  const [existingUser, setUserExisting] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerShown: !isScannerVisible,
    });
  }, [isScannerVisible]);


  useEffect(() => {
    console.log("fetching emails");
    fetchUsersFromFirebase();
    getJwtToken();
  }, []);


  const verifyUserId = (apiKey, email) => {
    const apiUrl = "https://expensey-backend.onrender.com/verify";
    const requestBody = JSON.stringify({ apiKey, email });

    ApiFetcher.checkUserId(apiUrl, requestBody)
      .then(result => {
        if (result.statusCode == "200") {
          addUserAccess(result.message);
          fetchUsersFromFirebase();
        }
      });
  }

  const handleBarCodeScanned = ({ type, data }) => {
    setLoading(false);
    setIsScannerVisible(false);

    const separatedData = data.split("//");
    const email = separatedData[0]; // This will hold the email
    const key = separatedData[1]; // This will hold the id
    verifyUserId(key, email);
  };

  async function addUserAccess(qrUserEmail) {
    if (!emails.emails.includes(qrUserEmail) && userID !== qrUserEmail) {
      const userAccessCol = collection(db, "UserAccess");

      // Set the "AccessUser" and "ParentUser" fields of the document
      const docRef = await addDoc(userAccessCol, {
        AccessUser: qrUserEmail,
        ParentUser: auth?.currentUser?.email
      });
    }
    else {
      setUserExisting(true);
      setTimeout(() => {
        setUserExisting(false);
      }, 5000);
    }
  }

  const fetchUsersFromFirebase = async () => {
    const userAccessQuery = query(
      collection(db, "UserAccess"),
      where("ParentUser", "==", userID)
    );
    const querySnapshot = await getDocs(userAccessQuery);
    const parents = [];
    querySnapshot.forEach((doc) => {
      parents.push(doc.data().AccessUser);
    });

    if (parents.length === 0) {
      setLoading(false);
    }

    dispatch(setEmails(parents));
  };

  const onLayoutHandler = () => {
    setLoading(false);
  };

  async function getCameraPermission() {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
      return false;
    }
    return true;
  }

  function getJwtToken() {
    setJwtToken(auth?.currentUser?.uid);
  }

  return (
    <>
      <TouchableOpacity
        style={[styles.Users.userContainer, { backgroundColor: 'lightgray', marginHorizontal: 10, marginTop: 20 }]}
        onPress={() => navigation.navigate("Images", { email: auth?.currentUser?.email, navigation })}
      >
        <Text style={styles.Users.userEmail}>Show My Images</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.Users.scrollView}>
        {emails.emails.map((email, index) => (
          <EmailItem
            key={index}
            email={email}
            index={index}
            navigation={navigation}
            onLayoutHandler={onLayoutHandler}
            emailsLength={emails.emails.length}
          />
        ))}

      </ScrollView>

      {loading && (
        <View style={styles.Users.backgroundButton}>
          <ActivityIndicator
            style={styles.Users.activityIndicator}
            size="large"
            color="#00b3ff"
          ></ActivityIndicator>
        </View>
      )}


      <View style={styles.Users.floatingFooter}>

      </View>

      <TouchableOpacity
        style={styles.Users.floatingButtonWide}
        onPress={async () => {
          setLoading(true);

          if (await getCameraPermission()) {
            setIsScannerVisible(true);
          }
        }} // Navigate to QRCodeScreen
      >
        <Text style={styles.Users.wideButtonText}>Scan QR</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.Users.floatingButtonqr}
        onPress={() => setIsvisible(true)}
      >
        <Text style={styles.Users.wideButtonText}>QR</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.Users.floatingButton}
        onPress={() => navigation.navigate("ImagePicker")}
      >
        <Text style={styles.Users.buttonText}>+</Text>
      </TouchableOpacity>

      {isScannerVisible && (
        <View style={styles.Users.scannerContainer}>
          <BarCodeScanner
            onBarCodeScanned={handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.Users.buttonContainer}>
            <Button title="Close Camera" onPress={() => { setIsScannerVisible(false); setLoading(false) }} color="#0000" />
          </View>
        </View>
      )}

      {existingUser && (
        <Text
          style={styles.Users.existingUserText}
          onPress={() => navigation.navigate("ImagePicker")}
        >
          User Already Added
        </Text>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={isvisible}
        statusBarTranslucent
        onRequestClose={() => setIsvisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1} // To prevent the opacity change when pressing
          style={styles.Users.backdrop}
          onPress={() => setIsvisible(false)}
        >
          <View style={styles.Users.centeredView}>
            <TouchableOpacity
              activeOpacity={1} // To prevent the opacity change when pressing
              onPress={() => { }} // Empty function to prevent propagation of onPress to the backdrop
            >
              <View style={styles.Users.modalView}>
                {isvisible && (
                  <Image
                    source={{
                      uri: `http://api.qrserver.com/v1/create-qr-code/?data=${userID + "//" + jwtToken}&size=${windowWidth}x${windowWidth}`,
                    }}
                    style={{ width: windowWidth - 200, height: windowWidth - 200 }}
                  />
                )}
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default UsersScreen;
