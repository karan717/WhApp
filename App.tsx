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
import { PathProvider } from './app/providers/PathProvider';
import { ElevationProvider } from './app/providers/ElevationProvider';
import { SoCProvider } from './app/providers/SoCProvider';
import { ChargerProvider } from './app/providers/ChargerProvider';
import { StatesProvider } from './app/providers/StatesProvider';

//Google maps
enableLatestRenderer();
//To build the EStyleSheet
EStyleSheet.build();


function App(): JSX.Element {

  return (
    <AuthProvider>
      <BLEProvider>
        <PathProvider>
          <ElevationProvider>
            <SoCProvider>
              <ChargerProvider>
                <StatesProvider>
                  <Navigation/>
                </StatesProvider>
              </ChargerProvider>
            </SoCProvider>
          </ElevationProvider>
        </PathProvider>
      </BLEProvider>
    </AuthProvider>
  );
}



//LogBox.ignoreAllLogs()

export default App;
