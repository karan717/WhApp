

import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { LogBox } from 'react-native';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import DraftPage from './app/DraftPage';
import Navigation from './app/navigation/Navigation';

import { AuthProvider } from './app/providers/AuthProvider';



function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = "bg-neutral-300 dark:bg-slate-900"



  return (
    <AuthProvider>
      <Navigation/>
    </AuthProvider>
  );
}


const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
})

//LogBox.ignoreAllLogs()

export default App;
