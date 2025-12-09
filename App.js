import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import AdminScreen from './screens/AdminScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName="Giriş"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Giriş" component={LoginScreen} />
        <Stack.Screen name="Kayıt" component={RegisterScreen} />
        <Stack.Screen name="Ana Sayfa" component={HomeScreen}/>
        <Stack.Screen name="Hakem Atama" component={AdminScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
