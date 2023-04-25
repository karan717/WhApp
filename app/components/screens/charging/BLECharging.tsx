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

import * as Progress from 'react-native-progress';

import {Colors} from 'react-native/Libraries/NewAppScreen';

const SECONDS_TO_SCAN_FOR = 3;
const SERVICE_UUIDS:any = [];
const ALLOW_DUPLICATES = false;

import BleManager from 'react-native-ble-manager';
import { Alert } from 'react-native';
import Button from '../../ui/Button';
import { useBLE } from '../../../hooks/useBLE';
import Loader from '../../ui/Loader';

const Separator = () => <View style={styles.separator} />;

const BLECharging= () => {
  const {whPeripheral,isScanning,peripherals,isConnected,receivedBatteryLevel,sendDataRPi,startScan,togglePeripheralConnection} = useBLE();


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
  function getColor(value:number) {
    //value from 0 to 1
    var hue = ((1 - value) * 120).toString(10);
    return ["hsl(", hue, ",100%,40%)"].join("");
  }

  return (
    <>
       <StatusBar barStyle="dark-content" />
       
        <SafeAreaView>
              <View style={styles.container}>

              {Number(receivedBatteryLevel)===0&&
              <>
                <Text className='text-center text-gray-800 text-xl'>Wheelchair not found</Text>
                <View className='w-4/5'>
                  <Separator />
                </View>
              </>}

                {Number(receivedBatteryLevel)>0&& <>        
                <Text style={styles.textBattery}>
                  WC Battery Level
                </Text>
                <Progress.Bar 
                progress={Number(receivedBatteryLevel)/100} 
                width={180} height={70} 
                color={getColor(1-Number(receivedBatteryLevel)/100)} 
                borderWidth={1}
                borderColor='#000000'/>
                <Text style={styles.text}>
                  {Number(receivedBatteryLevel)+'%'}
                </Text>
                <View className='w-4/5'>
                <Separator />
                </View>
                </> }
              

              {/* <Text className='text-2xl text-center pt-1'>Scan for Chargers</Text> */}
              
              <View style={{margin: 5, width:'80%'}}>
              {isScanning&&<Loader/>}
                <Button
                  title={isScanning ?'Searching...':'Search for Chargers'}
                  onPress={() => startScan() } 
                />     
                <Separator />    
              </View>



  

              {/* Chargers should be sorted by RSSI https://javascript.plainenglish.io/how-to-sort-a-map-in-javascript-es6-59751f06f692   */}
              <Text style={styles.textBattery}>Chargers</Text>
              {((new Map([...peripherals].filter(([k, v])=>k!==(whPeripheral!==undefined?whPeripheral.id:'LOL'))))).size!==0 ?
                <FlatList
                data={whPeripheral!==undefined ? Array.from((new Map([...peripherals].filter(([k, v])=>k!==whPeripheral.id))).values()):Array.from(peripherals.values())}
                contentContainerStyle={{rowGap: 12, padding:10}}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                /> : <Text style={styles.textBattery2}>Chargers not found</Text>
              }

              </View>
               
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
  text: {
    fontSize: 25,
    textAlign: 'center',
    margin: 10,
    color: "#1F2937",
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: 20,
    paddingTop: 20,
  },
  separator: {
    marginVertical: 15,
    borderBottomColor: '#1F2937',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});


export default BLECharging;