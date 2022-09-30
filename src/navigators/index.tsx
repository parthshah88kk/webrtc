import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Dashboard from 'screens/dashboard/Dashboard';
import Sample from 'screens/login/login';
import CallLog from '../simple-master/UIKit/GlobalCallModal/CallLogs';
import ChatScreen from '../simple-master/UIKit/GlobalCallModal/ChatScreen';

export const navigationRef: React.RefObject<NavigationContainerRef<any>> =
  React.createRef();
const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Sample}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Home" component={Dashboard} options={{ headerShown: false }} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CallLog" component={CallLog} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default AppNavigator;
