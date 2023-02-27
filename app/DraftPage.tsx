import React, { FC } from 'react'
import type {PropsWithChildren} from 'react';
import {
    SafeAreaView,
    ScrollView,
    TextInput,
    StyleSheet,
    Text,
    View,
    useColorScheme,
  } from 'react-native';
import {
DebugInstructions,
LearnMoreLinks,
} from 'react-native/Libraries/NewAppScreen';
type SectionProps = PropsWithChildren<{
title: string;
}>;
  
function Section({children, title}: SectionProps): JSX.Element {

  
    return (
      <View className="mt-8 px-2">
        <Text className="text-2xl text-black dark:text-white">
          {title}
        </Text>
        <Text className="mt-2 text-lg text-black dark:text-white">
          {children}
        </Text>
      </View>
    );
  }  
const DraftPage:FC = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const [text, onChangeText] = React.useState('Username')
    const [text2, onChangeText2] = React.useState('Password')
    const backgroundStyle = "bg-neutral-300 dark:bg-slate-900"
  return (
          <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        className={backgroundStyle}>
        <View className="bg-white dark:bg-black">
          <Section title="Wheelchair App, Step 1">
          First, the authentication should be implemented using
          database
          </Section>
          <Section title="Wheelchair App, Step 2">
            Add several pages with customized design.
          </Section>
          <TextInput style={styles.input}
            onChangeText={onChangeText}
            value = {text}/>
          <TextInput style={styles.input}
            onChangeText={onChangeText2}
            value = {text2}/>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
  )
}

const styles = StyleSheet.create({
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
  })

export default DraftPage




// /**
//  * Sample BLE React Native App
//  *
//  * @format
//  * @flow strict-local
//  */

// import React, {useState, useEffect} from 'react';
// import {
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   View,
//   Text,
//   StatusBar,
//   NativeModules,
//   NativeEventEmitter,
//   Platform,
//   PermissionsAndroid,
//   FlatList,
//   TouchableHighlight,
//   useColorScheme,
//   Pressable,
// } from 'react-native';

// import {Colors} from 'react-native/Libraries/NewAppScreen';

// const SECONDS_TO_SCAN_FOR = 3;
// const SERVICE_UUIDS:any = [];
// const ALLOW_DUPLICATES = false;

// import BleManager from 'react-native-ble-manager';
// import Button from '../ui/Button';
// const BleManagerModule = NativeModules.BleManager;
// const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

// const BLEScreenOLD2 = () => {
//   const [isScanning, setIsScanning] = useState(false);
//   const [peripherals, setPeripherals] = useState(new Map());
//   const theme = useColorScheme();

//   //console.log({peripherals: peripherals.entries()});

//   const updatePeripherals = (key:any, value:any) => {
//     setPeripherals(new Map(peripherals.set(key, value)));
//   };

//   const startScan = () => {
//     if (!isScanning) {
//       try {
//         console.log('Scanning...');
//         setIsScanning(true);
//         BleManager.scan(SERVICE_UUIDS, SECONDS_TO_SCAN_FOR, ALLOW_DUPLICATES);
//       } catch (error) {
//         console.error(error);
//       }
//     }
//   };

//   const handleStopScan = () => {
//     setIsScanning(false);
//     console.log('Scan is stopped');
//   };

//   const handleDisconnectedPeripheral = (data:any) => {
//     let peripheral = peripherals.get(data.peripheral);
//     if (peripheral) {
//       peripheral.connected = false;
//       updatePeripherals(peripheral.id, peripheral);
//     }
//     console.log('Disconnected from ' + data.peripheral);
//   };

//   const handleUpdateValueForCharacteristic = (data:any) => {
//     console.log(
//       'Received data from ' +
//         data.peripheral +
//         ' characteristic ' +
//         data.characteristic,
//       data.value,
//     );
//   };

//   const handleDiscoverPeripheral = (peripheral:any) => {
//     peripheral.advertising.localName=='rpi-gatt-server' && console.log('Got ble peripheral', peripheral);
//     if (!peripheral.name) {
//       peripheral.name = 'NO NAME';
//     }
//     peripheral.advertising.localName=='rpi-gatt-server' && updatePeripherals(peripheral.id, peripheral);
//   };

//   const togglePeripheralConnection = async (peripheral:any) => {
//     if (peripheral && peripheral.connected) {
//       BleManager.disconnect(peripheral.id);
//     } else {
//       connectPeripheral("C20327BF-0901-707E-8A2D-F7D8069A313C");
//     }
//   };

//   const connectPeripheral = async (id:any) => {
//     try {
      
//       await BleManager.connect(id);
//       console.log('connected')
//     } catch (error) {
//       console.log('Connection error', error);
//     }
//   };

//   async function sendDataRPi(data:number[]) {
//     console.log(data)
//     const peripheral ="C20327BF-0901-707E-8A2D-F7D8069A313C"
//     const service = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E"
//     const characteristic = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E"
//     await BleManager.connect(peripheral);
//     // Before startNotification you need to call retrieveServices
//     await BleManager.retrieveServices(peripheral);
//     // To enable BleManagerDidUpdateValueForCharacteristic listener
//     await BleManager.startNotification(peripheral, service, characteristic);
//     // Add event listener
//     const dataS = "Hi"
//     console.log(dataS)
//     await BleManager.write(
//       "C20327BF-0901-707E-8A2D-F7D8069A313C",
//       "6E400001-B5A3-F393-E0A9-E50E24DCCA9E",
//       "6E400002-B5A3-F393-E0A9-E50E24DCCA9E",
//       data
//     )
//       .then(() => {
//         // Success code
//         console.log("Write: " + data);
//       })
//       .catch((error) => {
//         // Failure code
//         console.log(error);
//       });

//   }

//   useEffect(() => {
//     BleManager.start({showAlert: false});
//     const listeners = [
//       bleManagerEmitter.addListener(
//         'BleManagerDiscoverPeripheral',
//         handleDiscoverPeripheral,
//       ),
//       bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan),
//       bleManagerEmitter.addListener(
//         'BleManagerDisconnectPeripheral',
//         handleDisconnectedPeripheral,
//       ),
//       bleManagerEmitter.addListener(
//         'BleManagerDidUpdateValueForCharacteristic',
//         handleUpdateValueForCharacteristic,
//       ),
//       bleManagerEmitter.addListener(
//         "BleManagerDidUpdateValueForCharacteristic",
//         ({ value, peripheral, characteristic, service }) => {
//           // Convert bytes array to string
//           const data = (value);
//           console.log(`Received ${data} for characteristic ${characteristic}`);
//         }
//       ),
//     ];

//     handleAndroidPermissionCheck();

//     return () => {
//       console.log('unmount');
//       for (const listener of listeners) {
//         listener.remove();
//       }
//     };
//   }, []);

//   const handleAndroidPermissionCheck = () => {
//     if (Platform.OS === 'android' && Platform.Version >= 23) {
//       PermissionsAndroid.check(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//       ).then(result => {
//         if (result) {
//           console.log('Permission is OK');
//         } else {
//           PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//           ).then(result => {
//             if (result) {
//               console.log('User accept');
//             } else {
//               console.log('User refuse');
//             }
//           });
//         }
//       });
//     }
//   };

//   const renderItem = ({item}:any) => {
//     const backgroundColor = item.connected ? "#069400" : Colors.white;
//     return (
//       <TouchableHighlight underlayColor='#0082FC'  onPress={() => togglePeripheralConnection(item)}>
//         <View style={[styles.row, {backgroundColor}]}>
//           <Text style={styles.peripheralName}>
//             {item.name} {item.connecting && 'Connecting...'}
//           </Text>
//           <Text style={styles.rssi}>RSSI: {item.rssi}</Text>
//           <Text style={styles.peripheralId}>{item.id}</Text>
//         </View>
//       </TouchableHighlight>
//     );
//   };

//   return (
//     <>
//        <StatusBar barStyle="dark-content" />
//         <SafeAreaView>
//           <ScrollView
//             contentInsetAdjustmentBehavior="automatic"
//             style={styles.scrollView}>
//             <View style={styles.body}>
              
//               <View style={{margin: 10}}>
//                 <Button 
//                   title={'Scan Bluetooth (' + (isScanning ? 'on' : 'off') + ')'}
//                   onPress={() => startScan() } 
//                 />            
//               </View>
  
//               <View style={{margin: 10}}>
//                 <Button title="Start BLE" onPress={() => console.log('disconnect') } />
//               </View>
//               <View style={{margin: 10}}>
//                 <Button title="stop scan" onPress={()=>handleStopScan()}/>
//               </View>
//               <View style={{margin: 10}}>
//                 <Button title="show peripherals" onPress={()=>console.log('disconnect')}/>
//               </View>
//               <View style={{margin: 10}}>
//                 <Button title="connect to RPi" onPress={()=>connectPeripheral("C20327BF-0901-707E-8A2D-F7D8069A313C")} />
//               </View>
//               <View style={{margin: 10}}>
//                 <Button title="disconnect RPi" onPress={()=>console.log('disconnect')} />
//               </View>

//               <View style={{margin: 10}}>
//                 <Button title="SendData" onPress={()=>sendDataRPi([72, 101, 108, 108, 111, 10])} />
//               </View>
  
//               {(Array.from(peripherals.values()).length == 0) &&
//                 <View style={{flex:1, margin: 20}}>
//                   <Text style={{textAlign: 'center'}}>No peripherals</Text>
//                 </View>
//               }
            
//             </View>              
//           </ScrollView>       
//         </SafeAreaView>
//     </>
//   );
// };

// const boxShadow = {
//   shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
// }


// const styles = StyleSheet.create({
//   scrollView: {
//     backgroundColor: Colors.lighter,
//   },
//   engine: {
//     position: 'absolute',
//     right: 10,
//     bottom: 0,
//     color: Colors.black,
//   },
//   scanButton: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 16,
//     backgroundColor: "#0a398a",
//     margin: 10,
//     borderRadius: 12,
//     ...boxShadow
    
//   },
//   scanButtonText: {
//     fontSize: 20,
//     letterSpacing: 0.25,
//     color: Colors.white,
//   },
//   body: {
//     backgroundColor: '#0082FC',
//     flex: 1,
//   },
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//     color: Colors.black,
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//     color: Colors.dark,
//   },
//   highlight: {
//     fontWeight: '700',
//   },
//   footer: {
//     color: Colors.dark,
//     fontSize: 12,
//     fontWeight: '600',
//     padding: 4,
//     paddingRight: 12,
//     textAlign: 'right',
//   },
//   peripheralName: {
//     fontSize: 16,
//     textAlign: 'center',
//     padding: 10,
//   },
//   rssi: {
//     fontSize: 12,
//     textAlign: 'center',
//     padding: 2,
//   },
//   peripheralId: {
//     fontSize: 12,
//     textAlign: 'center',
//     padding: 2,
//     paddingBottom: 20,
//   },
//   row: {
//     marginLeft: 10,
//     marginRight: 10,
//     borderRadius: 20,
//     ...boxShadow
//   },
//   noPeripherals: {
//     margin: 10,
//     textAlign: 'center',
//     color: Colors.white
//   },
// });


// export default BLEScreenOLD2;