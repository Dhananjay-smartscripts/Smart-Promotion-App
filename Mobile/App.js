import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DrawerNavigator from './navigation/DrawerNavigator';
import WelcomeScreen from './screens/WelcomeScreen';
import SignInScreen from './screens/SignInScreen';
import EnterpriseLoginScreen from './screens/EnterpriseLoginScreen';
import ForgotPassword from './screens/ForgotPassword';
import ResetPassword from './screens/ResetPassword';
import ChangePasswordScreen from './screens/ChangePasswordScreen';
import TemplateDetailScreen from './screens/TemplateDetails';
import ProfileScreen from './screens/ProfileScreen';
import linking from './linking';
import Toast from 'react-native-toast-message';
import BootSplash from 'react-native-bootsplash';
import ShowTemplate from './screens/ShowTemplate';
import Header from './components/Header';
import ContactDetails from './screens/ContactDetails';
import CardResultScreen from './screens/CardResultScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const rememberMe = await AsyncStorage.getItem('remember_me'); // <- new
        const token = await AsyncStorage.getItem('token');
        const userType = await AsyncStorage.getItem('user_type');
        const userId = await AsyncStorage.getItem('user_id');

        if (token && userType && userId) {
          setInitialRoute('HomeScreen');
        } else {
          // Remove everything if remember me was off
          await AsyncStorage.multiRemove(['token', 'user_id', 'user_type']);
          setInitialRoute('Welcome');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setInitialRoute('Welcome');
      }
    };

    checkAuth();
  }, []);


  if (!initialRoute) {
    // Show native splash until initial route is determined
    return null;
  }

  return (
    <>
      <NavigationContainer
        linking={linking}
        onReady={() => {
          BootSplash.hide({ fade: true }); // Hide splash only when navigation is fully ready
        }}
      >
        <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="EnterpriseLogin" component={EnterpriseLoginScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="ResetPassword" component={ResetPassword} />
          <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
          <Stack.Screen name="TemplateDetails" component={TemplateDetailScreen} />
          <Stack.Screen name="ShowTemplate" component={ShowTemplate} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
          <Stack.Screen name="Header" component={Header} />
          <Stack.Screen name="HomeScreen" component={DrawerNavigator} />
          <Stack.Screen name="ContactDetails" component={ContactDetails} />
          <Stack.Screen name="CardResultScreen" component={CardResultScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
}
