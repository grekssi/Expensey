import React, { useState, useEffect } from "react";
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
import { selectUserEmails } from "../features/imagesSlice";
import { TouchableOpacity } from "react-native";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { ActivityIndicator } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import QRCode from "react-native-qrcode-svg";
import { Camera } from 'expo-camera';
import { getEmails, setEmails } from "../features/emailsSlice";

const windowWidth = Dimensions.get('window').width;

const UsersScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const userID = auth?.currentUser?.email;
  const emails = useSelector((state) => getEmails(state));

  const [accessUsers, setAccessUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const [isvisible, setIsvisible] = useState(false);
  const [jwtToken, setJwtToken] = useState("");

  useEffect(() => {
    // This will update the navigation options dynamically.
    navigation.setOptions({
      headerShown: !isScannerVisible,
    });
  }, [isScannerVisible]);

  const handleBarCodeScanned = ({ type, data }) => {


    setIsScannerVisible(false);

    const separatedData = data.split("//")[0];
    const email = separatedData[0]; // This will hold the email

    addUserAccess(email);

    fetchData();
  };

  async function addUserAccess(qrUserEmail) {
    const userAccessCol = collection(db, "UserAccess");

    // Set the "AccessUser" and "ParentUser" fields of the document
    const docRef = await addDoc(userAccessCol, {
      AccessUser: qrUserEmail,
      ParentUser: auth?.currentUser?.email
    });
  }


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

    if (parents.length === 0) {
      setLoading(false);
    }

    dispatch(setEmails(parents));
  };



  let jwt = userID + "//" + jwtToken;

  useEffect(() => {
    fetchData();
    getJwtToken();
    console.log(auth?.currentUser?.uid);
  }, []);

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


    // auth.currentUser.getIdToken(true).then(function (idToken) {
    //   setJwtToken(idToken);
    // }).catch(function (error) {
    //   console.log("Error fetching jwt token")
    // });
  }

  return (
    <>
      <TouchableOpacity
        style={[styles.userContainer, { backgroundColor: 'lightgray', marginHorizontal: 10, marginTop: 20 }]}
        onPress={() => navigation.navigate("Images", { email: auth?.currentUser?.email })}
      >
        <Text style={styles.userEmail}>Show My Images</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollView}>
        {emails.emails.map((email, index) => (
          <TouchableOpacity
            key={index}
            style={styles.userContainer}
            onPress={() => navigation.navigate("Images", { email })}
            onLayout={
              index === emails.emails.length - 1 ? onLayoutHandler : undefined
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
        onPress={async () => {
          if (await getCameraPermission()) {
            setIsScannerVisible(true);
          }
        }} // Navigate to QRCodeScreen
      >
        <Text style={styles.wideButtonText}>Scan QR Code</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.floatingButtonqr}
        onPress={() => setIsvisible(true)}
      >
        <Text style={styles.wideButtonText}>QR</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isvisible}
        statusBarTranslucent
        onRequestClose={() => setIsvisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1} // To prevent the opacity change when pressing
          style={styles.backdrop}
          onPress={() => setIsvisible(false)}
        >
          <View style={styles.centeredView}>
            <TouchableOpacity
              activeOpacity={1} // To prevent the opacity change when pressing
              onPress={() => { }} // Empty function to prevent propagation of onPress to the backdrop
            >
              <View style={styles.modalView}>
                {isvisible && (
                  <Image
                    source={{
                      uri: `http://api.qrserver.com/v1/create-qr-code/?data=${jwt}&size=${windowWidth}x${windowWidth}`,
                    }}
                    style={{ width: windowWidth - 100, height: windowWidth - 100 }}
                  />
                )}
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate("ImagePicker")}
      >
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>

      {isScannerVisible && (
        <View style={styles.scannerContainer}>
          <BarCodeScanner
            onBarCodeScanned={handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.buttonContainer}>
            <Button title="Close Camera" onPress={() => setIsScannerVisible(false)} color="#0000" />
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  scannerContainer: {
    flex: 1,
    backgroundColor: 'black',
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  buttonContainer: {
    backgroundColor: 'transparent',
    marginBottom: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '80%',
  },
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
  floatingButtonqr: {
    position: "absolute",
    bottom: 20,
    right: 100,
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
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default UsersScreen;
