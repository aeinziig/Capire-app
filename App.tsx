import 'nativewind/css/dist/index.css';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashScreen } from './screens/authentication/SplashScreen';
import { LoginScreen } from './screens/authentication/LoginScreen';
import { RegisterScreen } from './screens/authentication/RegisterScreen';
import { ForgotPasswordScreen } from './screens/authentication/ForgotPasswordScreen';
import { OTPVerificationScreen } from './screens/authentication/OTPVerificationScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
