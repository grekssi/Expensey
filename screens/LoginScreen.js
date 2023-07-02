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
import styles from "../styles";

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
    <KeyboardAvoidingView style={styles.Login.container}>
      <Image
        source={require("../assets/expenseyLogo.png")}
        style={styles.Login.logo}
      />
      <View style={styles.Login.inputContainer}>
        <TextInput
          placeholder="Email"
          placeholderTextColor="#424242"
          style={styles.Login.input}
          keyboardType="email-address"
          value={userEmail}
          onChangeText={(text) => setEmail(text)}
        />
        <View style={styles.Login.passwordContainer}>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#424242"
            style={styles.Login.input}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(text) => setPassword(text)}
            onSubmitEditing={signIn}
          />
          <TouchableOpacity
            style={styles.Login.eyeIcon}
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
        containerStyle={styles.Login.button}
        buttonStyle={styles.Login.loginButton}
        titleStyle={styles.Login.buttonText}
        onPress={signIn}
        title="Login"
      />
      <Button
        containerStyle={styles.Login.button}
        buttonStyle={styles.Login.registerButton}
        titleStyle={styles.Login.registerButtonText}
        onPress={() => navigation.navigate("Register")}
        type="outline"
        title="Register"
      />
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
