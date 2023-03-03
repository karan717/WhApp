import React from 'react';
import { LogBox } from 'react-native';

import {
  View,
} from 'react-native';
import Navigation from './app/navigation/Navigation';

import { AuthProvider } from './app/providers/AuthProvider';
import EStyleSheet from 'react-native-extended-stylesheet';
import {enableLatestRenderer} from 'react-native-maps';
import { BLEProvider } from './app/providers/BLEProvider';

//Google maps
enableLatestRenderer();
//To build the EStyleSheet
EStyleSheet.build();


function App(): JSX.Element {

  return (
    <AuthProvider>
      <BLEProvider>
        <Navigation/>
      </BLEProvider>
    </AuthProvider>
  );
}



//LogBox.ignoreAllLogs()

export default App;
