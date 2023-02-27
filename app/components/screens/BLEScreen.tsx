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
import Button from '../ui/Button';
import { Alert } from 'react-native';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const BLEScreen = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [peripherals, setPeripherals] = useState(new Map());
  const [receivedData, setReceivedData] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [peripheralConnected, setPeripheralConnected] = useState<Object | any>('') //connected peripherals, able to connect to only one?

  //console.log({peripherals: peripherals.entries()});

  const updatePeripherals = (key:any, value:any) => {
    setPeripherals(new Map(peripherals.set(key, value)));
  };

  const startScan = () => {
    if (!isScanning) {
      try {
        console.log('Scanning...');
        setIsScanning(true);
        //Set to initial state...
        setIsConnected(false);
        setPeripherals(new Map());
        setReceivedData('');
        BleManager.scan(SERVICE_UUIDS, SECONDS_TO_SCAN_FOR, ALLOW_DUPLICATES);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleStopScan = () => {
    setIsScanning(false);
    console.log('Scan is stopped');
    console.log(peripherals)
  };

  const handleDisconnectedPeripheral = (data:any) => {
    let peripheral = peripherals.get(data.peripheral);
    if (peripheral) {
      peripheral.connected = false;
      updatePeripherals(peripheral.id, peripheral);
    }
    console.log('Disconnected from ' + data.peripheral);
  };

  const handleUpdateValueForCharacteristic = (data:any) => {
    console.log(
      'Received data from ' +
        data.peripheral +
        ' characteristic ' +
        data.characteristic,
      data.value,
    );
    let outData = Utf8ArrayToStr(data.value)
    setReceivedData(receivedData+outData)

    function Utf8ArrayToStr(array:any) {
      var out, i, len, c;
      var char2, char3;
  
      out = "";
      len = array.length;
      i = 0;
      while(i < len) {
      c = array[i++];
      switch(c >> 4)
      { 
        case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
          // 0xxxxxxx
          out += String.fromCharCode(c);
          break;
        case 12: case 13:
          // 110x xxxx   10xx xxxx
          char2 = array[i++];
          out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
          break;
        case 14:
          // 1110 xxxx  10xx xxxx  10xx xxxx
          char2 = array[i++];
          char3 = array[i++];
          out += String.fromCharCode(((c & 0x0F) << 12) |
                         ((char2 & 0x3F) << 6) |
                         ((char3 & 0x3F) << 0));
          break;
      }
      }
  
      return out;
  }
  };

  const handleDiscoverPeripheral = (peripheral:any) => {
    if(peripheral.advertising.localName){ //if peripheral has local name then check
      peripheral.advertising.localName.substring(0,15)=='rpi-gatt-server' && console.log('Got ble peripheral', peripheral);
      peripheral.advertising.localName.substring(0,15)=='rpi-gatt-server' && updatePeripherals(peripheral.id, peripheral);
      //console.log(typeof peripheral)
    }
    else{

    }
  };

  const togglePeripheralConnection = async (peripheral:any) => {
    if (peripheral && peripheral.connected) {
      BleManager.disconnect(peripheral.id);
      setIsConnected(false)
      setPeripheralConnected('')
    } else {
      connectPeripheral(peripheral);
    }
  };

  

  const connectPeripheral = async (peripheral:any) => {
    const peripheralUUID =peripheral.id
    const service = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E"
    const characteristic = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E" //reading characteristic UUID

    try {
      if (peripheral) {
        markPeripheral({connecting: true});
        await BleManager.connect(peripheralUUID);
        // Before startNotification you need to call retrieveServices
        await BleManager.retrieveServices(peripheralUUID);
        // To enable BleManagerDidUpdateValueForCharacteristic listener
        await BleManager.startNotification(peripheralUUID, service, characteristic);
        markPeripheral({connecting: false, connected: true});
        setIsConnected(true)
        setPeripheralConnected(peripheral)
      }
      
      console.log('connected');
    } catch (error) {
      console.log('Connection error', error);
    }

    function markPeripheral(props:any) {
      updatePeripherals(peripheral.id, {...peripheral, ...props});
    }
  };

  async function sendDataRPi(data:string) {
    console.log(data)
    const peripheral ="C20327BF-0901-707E-8A2D-F7D8069A313C"
    const service = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E"
    const characteristic = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E" //writing char UUID

    const dataS = toUTF8Array(data)
    console.log(dataS)
    await BleManager.write(peripheral, service, characteristic,dataS)
      .then(() => {
        // Success code
        console.log("Write: " + data);
      })
      .catch((error) => {
        // Failure code
        console.log(error);
        setIsConnected(false);
        setReceivedData('')
        markPeripheral({connecting: false, connected: false});
      });

      function markPeripheral(props:any) {
        updatePeripherals(peripheralConnected.id, {...peripheralConnected, ...props});
      }


      function toUTF8Array(str:string) {
        let utf8 = [];
        for (let i = 0; i < str.length; i++) {
            let charcode = str.charCodeAt(i);
            if (charcode < 0x80) utf8.push(charcode);
            else if (charcode < 0x800) {
                utf8.push(0xc0 | (charcode >> 6),
                          0x80 | (charcode & 0x3f));
            }
            else if (charcode < 0xd800 || charcode >= 0xe000) {
                utf8.push(0xe0 | (charcode >> 12),
                          0x80 | ((charcode>>6) & 0x3f),
                          0x80 | (charcode & 0x3f));
            }
            // surrogate pair
            else {
                i++;
                // UTF-16 encodes 0x10000-0x10FFFF by
                // subtracting 0x10000 and splitting the
                // 20 bits of 0x0-0xFFFFF into two halves
                charcode = 0x10000 + (((charcode & 0x3ff)<<10)
                          | (str.charCodeAt(i) & 0x3ff));
                utf8.push(0xf0 | (charcode >>18),
                          0x80 | ((charcode>>12) & 0x3f),
                          0x80 | ((charcode>>6) & 0x3f),
                          0x80 | (charcode & 0x3f));
            }
        }
        return utf8;
    }

  }

  useEffect(() => {
    BleManager.start({showAlert: false});
    const listeners = [
      bleManagerEmitter.addListener("BleManagerDidUpdateState", (args) => {
        console.log(args.state)
        if(args.state=="off" || args.state=="turning_off"){
          Alert.alert("Turn on Bluetooth, to work with this program");
        }
      }),
      bleManagerEmitter.addListener(
        'BleManagerDiscoverPeripheral',
        handleDiscoverPeripheral,
      ),
      bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan),
      bleManagerEmitter.addListener(
        'BleManagerDisconnectPeripheral',
        handleDisconnectedPeripheral,
      ),
      bleManagerEmitter.addListener(
        'BleManagerDidUpdateValueForCharacteristic',
        handleUpdateValueForCharacteristic,
      ),
    ];

    handleAndroidPermissionCheck();

    return () => {
      console.log('unmount');

      setPeripherals(new Map())
      setReceivedData('')
      setIsConnected(false);

      for (const listener of listeners) {
        listener.remove();
      }
    };
  }, []);

  const handleAndroidPermissionCheck = () => {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then(result => {
        if (result) {
          console.log('Permission is OK');
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ).then(result => {
            if (result) {
              console.log('User accept');
            } else {
              console.log('User refuse');
            }
          });
        }
      });
    }
  };

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
  
              {
              isConnected &&
              <View style={styles.buttonStyleContainer}>
                <TouchableHighlight 
                onPress={()=>sendDataRPi("Start Charging")} 
                underlayColor="#FBBF24"
                className={`bg-yellow-300 text-gray-800 rounded-xl my-4 py-2 m-3 w-5/12`}>
                    <Text className='text-gray-800 text-center text-lg'>
                        Start Charging
                    </Text>
                </TouchableHighlight>
                <TouchableHighlight 
                onPress={()=>sendDataRPi("Stop Charging")} 
                underlayColor="#FBBF24"
                className={`bg-yellow-300 text-gray-800 rounded-xl my-4 py-2 m-3 w-5/12`}>
                    <Text className='text-gray-800 text-center text-lg'>
                        Stop Charging
                    </Text>
                </TouchableHighlight>
              </View>
              }

              <View style={styles.body}>
                <ScrollView>
                  <Text style={styles.peripheralName}>Received Data:</Text>
                  <Text style={styles.peripheralName}>{receivedData}</Text>
                </ScrollView>
              </View>
  
              {(Array.from(peripherals.values()).length == 0) &&
                <View style={{flex:1, margin: 20}}>
                  <Text style={{textAlign: 'center'}}>No peripherals</Text>
                </View>
              }
              <View style={{margin:10}}>
              <FlatList
                data={Array.from(peripherals.values())}
                contentContainerStyle={{rowGap: 12, padding:10}}
                renderItem={renderItem}
                keyExtractor={item => item.id}
              />
            </View>
            
               
        </SafeAreaView>

    </>
  );
};

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
});


export default BLEScreen;