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
import { auth, db, storage } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import {
  selectImages,
  selectUserEmails,
  setImages,
} from "../features/imagesSlice";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";

const windowWidth = Dimensions.get("window").width;

const UsersScreen = ({ navigation }) => {
  const userID = auth.currentUser.email;
  const [accessUsers, setAccessUsers] = useState([]);

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
  }, []); // Empty dependency array means this effect will only run once (like componentDidMount in classes)
  return (
    <>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {useSelector((state) => selectUserEmails(state, accessUsers)).map(
          (email, index) => (
            <TouchableOpacity
              key={index}
              style={styles.userContainer}
              onPress={() => navigation.navigate("Images", { email })}
            >
              <Text style={styles.userEmail}>{email}</Text>
            </TouchableOpacity>
          )
        )}
      </ScrollView>
      <TouchableOpacity
        style={styles.floatingButtonWide}
        onPress={() => navigation.navigate("ImagePicker")} // You can change the navigation here
      >
        <Text style={styles.wideButtonText}>Add User</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate("ImagePicker")}
      >
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
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
