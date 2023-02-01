import React from 'react';
import { LogBox } from 'react-native';

import {
  View,
} from 'react-native';
import DraftPage from './app/DraftPage';
import Navigation from './app/navigation/Navigation';

import { AuthProvider } from './app/providers/AuthProvider';
import EStyleSheet from 'react-native-extended-stylesheet';

//To build the EStyleSheet
EStyleSheet.build();


function App(): JSX.Element {

  return (
    <AuthProvider>
      <Navigation/>
    </AuthProvider>
  );
}



//LogBox.ignoreAllLogs()

export default App;
