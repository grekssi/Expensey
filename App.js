import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import { TailwindProvider } from "tailwindcss-react-native";
import ImagePickerScreen from "./screens/ImagePickerScreen";
import ImagesScreen from "./screens/ImagesScreen";
import LoadingScreen from "./screens/LoadingScreen";
import { store } from "./store";
import { Provider } from "react-redux";
import UsersScreen from "./screens/UsersScreen";
import { auth } from "./firebase";

const Stack = createStackNavigator();
const globalScreenOptions = {
  headerStyle: { backgroundColor: "black" },
  headerTitleStyle: { color: "black" },
  headerTintColor: "black",
};

export default function App() {
  return (
    <NavigationContainer>
      <Provider store={store}>
        <TailwindProvider>
          <StatusBar style="light" backgroundColor="#000" />
          <Stack.Navigator screenOptions={globalScreenOptions}>

            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ presentation: "fullScreenModal", headerShown: false }}
            />

            <Stack.Screen
              name="Loading"
              component={LoadingScreen}
              options={{ presentation: "fullScreenModal", headerShown: false }}
            />

            <Stack.Screen name="ImagePicker" component={ImagePickerScreen} options={{
              title: "Image Picker",
              headerStyle: {
                backgroundColor: "#F3F3F3",
              },
              headerTintColor: "#424242",
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }} />

            <Stack.Screen
              name="Images"
              component={ImagesScreen}
              options={{
                title: "User Images",
                headerStyle: {
                  backgroundColor: "#F3F3F3",
                  elevation: 0,
                  shadowOpacity: 0,
                  borderBottomWidth: 0,
                },
                headerTintColor: "#424242",
                headerTitleStyle: {
                  fontWeight: "bold",
                },
              }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ presentation: "fullScreenModal", headerShown: false }}
            />
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ presentation: "fullScreenModal", headerShown: false }}
            />
            <Stack.Screen
              name="Users"
              component={UsersScreen}
              options={({ navigation }) => ({
                title: "User Images",
                headerStyle: {
                  backgroundColor: "#F3F3F3",
                  elevation: 0,
                  shadowOpacity: 0,
                  borderBottomWidth: 0,
                },
                headerTintColor: "#424242",
                headerTitleStyle: {
                  fontWeight: "bold",
                },
                headerRight: () => (
                  <Text style={styles.logoutText} onPress={async () => {
                    await auth.signOut();
                    navigation.replace("Login");
                  }}>
                    Logout
                  </Text>
                ),
              })}
            />
          </Stack.Navigator>
        </TailwindProvider>
      </Provider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    marginRight: 10,
    color: '#424242',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
