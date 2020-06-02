import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Login from './screens/login';
import Authenticator from './screens/authenticator';
import Register from './screens/register';
import HomeScreen from './screens/homeScreen';

const Stack = createStackNavigator();

export default function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Authenticator"
        component={Authenticator}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
