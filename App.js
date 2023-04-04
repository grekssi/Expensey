import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import { TailwindProvider } from 'tailwindcss-react-native';
import ImagePickerScreen from './screens/ImagePickerScreen';
import ImagesScreen from './screens/ImagesScreen';
import ImageUploadedScreen from './screens/ImageUploadedScreen';
import LoadingScreen from './screens/LoadingScreen';
import { store } from './store';
import { Provider } from 'react-redux';
import UsersScreen from './screens/UsersScreen';

const Stack = createStackNavigator();
const globalScreenOptions = {
  headerStyle: { backgroundColor: "#2C6BED" },
  headerTitleStyle: { color: "white" },
  headerTintColor: "white"
}

export default function App() {
  return (
    <NavigationContainer>
      <Provider store={store}>
        <TailwindProvider>
          <Stack.Navigator screenOptions={globalScreenOptions}>
            <Stack.Screen name="Login" component={LoginScreen} options={{ presentation: "fullScreenModal", headerShown: false }} />

            <Stack.Screen name="Loading" component={LoadingScreen} options={{ presentation: "fullScreenModal", headerShown: false }} />



            <Stack.Screen name="ImagePicker" component={ImagePickerScreen} />
            <Stack.Screen name="ImageUploaded" component={ImageUploadedScreen} options={{ presentation: "fullScreenModal", headerShown: false }} />




            <Stack.Screen name="Images" component={ImagesScreen} options={{ presentation: "fullScreenModal", headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ presentation: "fullScreenModal", headerShown: false }} />
            <Stack.Screen name="Home" component={HomeScreen} options={{ presentation: "fullScreenModal", headerShown: false }} />
            <Stack.Screen name="Users" component={UsersScreen} options={{ presentation: "fullScreenModal", headerShown: false }} />

          </Stack.Navigator>
        </TailwindProvider>
      </Provider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
