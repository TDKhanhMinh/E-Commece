import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileScreen } from '../screens/ProfileScreen';
import { MyVehicleScreen } from '../screens/MyVehicleScreen';
import { BankAccountScreen } from '../screens/BankAccountScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { SupportScreen } from '../screens/SupportScreen';
import { PolicyScreen } from '../screens/PolicyScreen';
import type { ProfileStackParamList } from '@navigation/types';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="ProfileMain"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="MyVehicle" component={MyVehicleScreen} />
      <Stack.Screen name="BankAccount" component={BankAccountScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="SupportCenter" component={SupportScreen} />
      <Stack.Screen name="PolicyTerms" component={PolicyScreen} />
    </Stack.Navigator>
  );
}
