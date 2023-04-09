import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Button, Input, Image } from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import { KeyboardAvoidingView } from "react-native";
import { auth, storage } from "../firebase";
import { FontAwesome } from "@expo/vector-icons";
import {
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  browserLocalPersistence,
  inMemoryPersistence,
  indexedDBLocalPersistence,
} from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import {
  selectImages,
  selectUserEmails,
  setImages,
} from "../features/imagesSlice";

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const signIn = () => {
    signInWithEmailAndPassword(auth, email, password).catch((error) =>
      alert(error)
    );

    fetchImages();
  };

  const fetchImages = async () => {
    try {
      const imageFolderRef = ref(storage, "images");
      const imageList = await listAll(imageFolderRef);
      const urlsByMonth = {};

      for (const imageRef of imageList.items) {
        const url = await getDownloadURL(imageRef);
        // const month = imageRef.name.slice(0, 7);

        const dataArray = imageRef.name.split(":");

        const email = dataArray[0];
        const year = parseInt(dataArray[2], 10);
        const month =
          parseInt(dataArray[1], 10).toString() + "/" + year.toString();
        const amount = parseFloat(dataArray[3]);

        if (!urlsByMonth[month]) {
          urlsByMonth[month] = [];
        }

        var obj = {
          email: email,
          month: month,
          year: year,
          amount: amount,
          url: url,
        };

        urlsByMonth[month].push(obj);
      }
      dispatch(setImages(urlsByMonth));
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Login",
      headerTitleAlign: "center",
    });
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        navigation.replace("Users");
      }
    });

    return unsubscribe;
  });

  return (
    <KeyboardAvoidingView style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={{
          uri: "https://seeklogo.com/images/S/signal-logo-20A1616F60-seeklogo.com.png",
        }}
        style={styles.logo}
      />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          placeholderTextColor="#424242"
          style={styles.input}
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#424242"
            style={styles.input}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(text) => setPassword(text)}
            onSubmitEditing={signIn}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <FontAwesome
              name={showPassword ? "eye-slash" : "eye"}
              size={24}
              color="#424242"
            />
          </TouchableOpacity>
        </View>
      </View>

      <Button
        containerStyle={styles.button}
        buttonStyle={styles.loginButton}
        titleStyle={styles.buttonText}
        onPress={signIn}
        title="Login"
      />
      <Button
        containerStyle={styles.button}
        buttonStyle={styles.registerButton}
        titleStyle={styles.registerButtonText}
        onPress={() => navigation.navigate("Register")}
        type="outline"
        title="Register"
      />
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#F3F3F3",
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 30,
  },
  inputBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 10,
    borderColor: "#2196F3",
    borderWidth: 1,
  },
  inputContainer: {
    width: 300,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 10,
    borderColor: "#2196F3",
    borderWidth: 1,
    fontFamily: "Roboto",
    color: "#424242",
    textAlign: "center",
    height: 40,
    width: 300
  },
  passwordContainer: {
    width: 300,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  eyeIcon: {
    marginLeft: 10,
    marginBottom: 10
  },
  button: {
    width: 200,
    marginTop: 10,
  },
  loginButton: {
    backgroundColor: "#2196F3",
    borderRadius: 10,
  },
  registerButton: {
    color: "2196F3",
    borderColor: "#2196F3",
    borderRadius: 10,
    borderWidth: 2,
  },
  buttonText: {
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
