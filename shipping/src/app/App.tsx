import 'react-native-gesture-handler';
import '../../global.css';
import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { AppProvider } from '@providers/AppProvider';
import { RootNavigator } from '@navigation/RootNavigator';

function AppContent() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <RootNavigator />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
