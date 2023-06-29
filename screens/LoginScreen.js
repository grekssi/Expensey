import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Button, Image } from "react-native-elements";
import { KeyboardAvoidingView } from "react-native";
import { auth } from "../firebase";
import { FontAwesome } from "@expo/vector-icons";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";

const LoginScreen = ({ navigation }) => {
  const [userEmail, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const signIn = () => {
    signInWithEmailAndPassword(auth, userEmail, password).catch((error) =>
      alert(error)
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Login",
      headerTitleAlign: "center",
    });
  }, [navigation]);


  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      try {
        if (authUser) {
          navigation.replace("Users");
        } else {
          // reset the states when user logs out
          setEmail("");
          setPassword("");
        }
      } catch (error) {
        console.log(error);
      }
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Image
        source={require("../assets/expenseyLogo.png")}
        style={styles.logo}
      />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          placeholderTextColor="#424242"
          style={styles.input}
          keyboardType="email-address"
          value={userEmail}
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
    padding: 10,
    backgroundColor: "#F3F3F3",
  },
  logo: {
    width: 180,
    height: 180,
    marginTop: 100
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
    marginTop: 100
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 10,
    borderColor: "#2196F3",
    borderWidth: 1,
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
