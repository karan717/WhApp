/**
 * Sample BLE React Native App
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  NativeModules,
  NativeEventEmitter,
  Platform,
  PermissionsAndroid,
  FlatList,
  TouchableHighlight,
  Pressable,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

const SECONDS_TO_SCAN_FOR = 3;
const SERVICE_UUIDS:any = [];
const ALLOW_DUPLICATES = false;

import BleManager from 'react-native-ble-manager';
import { Alert } from 'react-native';
import Button from '../../ui/Button';
import { useBLE } from '../../../hooks/useBLE';


const BLECharging= () => {
  const {whPeripheral,isScanning,peripherals,isConnected,receivedData,sendDataRPi,startScan,togglePeripheralConnection} = useBLE();


  const renderItem = ({item}:any) => {
    const backgroundColor = item.connected ? "#069400" : Colors.white;
    return (
      <TouchableHighlight underlayColor='#0082FC'  onPress={() => togglePeripheralConnection(item)}>
        <View style={[styles.row, {backgroundColor}]}>
          <Text style={styles.peripheralName}>
            {item.advertising.localName} {item.connecting && 'Connecting...'}
          </Text>
          <Text style={styles.peripheralId}>{item.id}</Text>
        </View>
      </TouchableHighlight>
    );
  };

  return (
    <>
       <StatusBar barStyle="dark-content" />
       
        <SafeAreaView>
              
              <View style={{margin: 5}}>
                <Button
                  title={'Scan Bluetooth (' + (isScanning ? 'scanning...' : 'off') + ')'}
                  onPress={() => startScan() } 
                />            
              </View>
  
              {/* {
              false && isConnected &&
              <View style={styles.buttonStyleContainer}>
                <TouchableHighlight 
                onPress={()=>{sendDataRPi(`517229:11:29:22:@`,whPeripheral)}} 
                underlayColor="#FBBF24"
                className={`bg-yellow-300 text-gray-800 rounded-xl my-4 py-2 m-3 w-5/12`}>
                    <Text className='text-gray-800 text-center text-lg'>
                        Update SoC
                    </Text>
                </TouchableHighlight>
                <TouchableHighlight 
                onPress={()=>{let item = whPeripheral; item.connected=true; togglePeripheralConnection(item)}} 
                underlayColor="#FBBF24"
                className={`bg-yellow-300 text-gray-800 rounded-xl my-4 py-2 m-3 w-5/12`}>
                    <Text className='text-gray-800 text-center text-lg'>
                        Disconnect Chair
                    </Text>
                </TouchableHighlight>
              </View>
              } */}
              {/* { false &&
              <View style={styles.body}>
                <ScrollView>
                  <Text style={styles.peripheralName}>Received Data:</Text>
                  <Text style={styles.peripheralName}>{receivedData}</Text>
                </ScrollView>
              </View>
              } */}
  
              {/* {(Array.from(peripherals.values()).length == 0) &&
                <View style={{flex:1, margin: 20}}>
                  <Text style={{textAlign: 'center'}}>No peripherals</Text>
                </View>
              } */}

              {/* Work on the logic of this part */}
              <Text style={styles.textBattery}> Wheelchair</Text>
              {whPeripheral!==undefined ?
              <FlatList
              data={whPeripheral!==undefined ? Array.from((new Map([...peripherals].filter(([k, v])=>k===whPeripheral.id))).values()):Array.from(new Map())}
              contentContainerStyle={{rowGap: 12, padding:10}}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              /> : <Text style={styles.textBattery2}>Couldn't find your wheelchair</Text>

              }

              {/* Chargers should be sorted by RSSI https://javascript.plainenglish.io/how-to-sort-a-map-in-javascript-es6-59751f06f692   */}
              <Text style={styles.textBattery}>Chargers</Text>
              {((new Map([...peripherals].filter(([k, v])=>k!==(whPeripheral!==undefined?whPeripheral.id:'LOL'))))).size!==0 ?
                <FlatList
                data={whPeripheral!==undefined ? Array.from((new Map([...peripherals].filter(([k, v])=>k!==whPeripheral.id))).values()):Array.from(peripherals.values())}
                contentContainerStyle={{rowGap: 12, padding:10}}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                /> : <Text style={styles.textBattery2}>Chargers are not found nearby</Text>
              }

            
               
        </SafeAreaView>

    </>
  );
};
{/* <FlatList
data={Array.from(peripherals.values())}
contentContainerStyle={{rowGap: 12, padding:10}}
renderItem={renderItem}
keyExtractor={item => item.id}
/> */}
const boxShadow = {
  shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
}


const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 10,
    bottom: 0,
    color: Colors.black,
  },
  scanButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: "#0a398a",
    margin: 10,
    borderRadius: 12,
    ...boxShadow
    
  },
  scanButtonText: {
    fontSize: 20,
    letterSpacing: 0.25,
    color: Colors.white,
  },
  body: {
    backgroundColor: '#0082FC',
    margin:10,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  peripheralName: {
    fontSize: 20,
    textAlign: 'center',
    padding: 5,
  },
  rssi: {
    fontSize: 12,
    textAlign: 'center',
    padding: 2,
  },
  peripheralId: {
    fontSize: 12,
    textAlign: 'center',
    padding: 2,
    paddingBottom: 20,
  },
  row: {
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 20,
    ...boxShadow
  },
  noPeripherals: {
    margin: 10,
    textAlign: 'center',
    color: Colors.white
  },
  buttonStyleContainer: {
    flexWrap: 'wrap', 
    alignItems: 'flex-start', 
    justifyContent: 'center',
    flexDirection:'row',
    borderWidth:0,
    
  },
  textBattery: {
    fontSize: 25,
    textAlign: 'center',
    margin: 10,
    color: "#1F2937",
  },
  textBattery2: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: "#1F2937",
  },
});


export default BLECharging;