import React, {useState, useEffect, useMemo, FC, createContext} from 'react';
import {
  NativeModules,
  NativeEventEmitter,
  Platform,
  PermissionsAndroid,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

const SECONDS_TO_SCAN_FOR = 5;
const SERVICE_UUIDS:any = [];
const ALLOW_DUPLICATES = false;

import BleManager from 'react-native-ble-manager';
import { Alert } from 'react-native';
import { value } from 'react-native-extended-stylesheet';
import { Utf8ArrayToStr } from '../utils/Utf8ArrayToStr';
import { toUTF8Array } from '../utils/toUTF8Array';
import { useProfile } from '../components/screens/profile/useProfile';

interface BLEContext {
    isScanning: boolean
    peripherals: Map<any,any>
    whPeripheral: any | string
    receivedData: string
    isConnected: boolean
    startScan: ()=> void
    togglePeripheralConnection: (peripheral: any) => Promise<void>
    connectPeripheral: (peripheral: any) => Promise<void>
    sendDataRPi(data: string, peripheral: any): Promise<void>
}

interface Props {
    children: React.ReactNode;
}


export const BLEContext = createContext<BLEContext>({} as BLEContext)

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);



export const BLEProvider: FC<Props> =  ({children})  => {
  const [isScanning, setIsScanning] = useState(false); //Scanning for BLE devices Wheelchair or Chargers
  const [peripherals, setPeripherals] = useState(new Map()); //all peripherals
  const [whPeripheral, setWhPeripheral] = useState<Object | any>() //Wheelchair peripheral only
  const [receivedData, setReceivedData] = useState(''); //Received Data
  const [isConnected, setIsConnected] = useState(false);
 const {WhID} = useProfile()
  //console.log({peripherals: peripherals.entries()});

  const updatePeripherals = (key:any, value:any) => {
    setPeripherals(new Map(peripherals.set(key, value)));
  };

  const startScan = async () => {
    if (!isScanning) {
      try {
        console.log('Scanning...');
        setIsScanning(true);
        await BleManager.scan(SERVICE_UUIDS, SECONDS_TO_SCAN_FOR, ALLOW_DUPLICATES);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleStopScan = () => {
    setIsScanning(false);
    console.log('Scan is stopped');
    console.log('Peripherals found',peripherals)
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
    setReceivedData(outData) //See how to identify that we received data from Wh or Ch

  };

  const handleDiscoverPeripheral = (peripheral:any) => {
    if(peripheral.advertising.localName){ //if peripheral has local name then check
      peripheral.advertising.localName.substring(0,4)=='ACL-' && console.log('Got ble peripheral', peripheral);
      peripheral.advertising.localName.substring(0,7)=='ACL-Wh-' && updatePeripherals(peripheral.id, peripheral);
      peripheral.advertising.localName.substring(0,7)=='ACL-Wh-' && setWhPeripheral(peripheral);
      peripheral.advertising.localName.substring(0,7)=='ACL-Wh-' && console.log('Got Wh peripheral');
      peripheral.advertising.localName.substring(0,7)=='ACL-Ch-' && updatePeripherals(peripheral.id, peripheral);

      //console.log(typeof peripheral)
    }
    else{

    }
  };

  const togglePeripheralConnection = async (peripheral:any) => {
    if (peripheral && peripheral.connected) {
      await BleManager.disconnect(peripheral.id);
      setIsConnected(false)
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
      }
      
      console.log('connected');
    } catch (error) {
      console.log('Connection error', error);
    }

    function markPeripheral(props:any) {
      updatePeripherals(peripheral.id, {...peripheral, ...props});
    }
  };

  async function sendDataRPi(data:string,peripheral:any) {
    console.log(data)
    const peripheralUUID =peripheral.id
    const service = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E"
    const characteristic = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E" //writing char UUID

    const dataS = toUTF8Array(data)
    console.log(dataS)
    await BleManager.write(peripheralUUID, service, characteristic,dataS)
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
        updatePeripherals(peripheral.id, {...peripheral, ...props});
      }



  }

  useEffect(() => {
    handleAndroidPermissionCheck();
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

    


    return () => {
      console.log('unmount useBLE');

    //   setPeripherals(new Map())
    //   setReceivedData('')
    //   setIsConnected(false);

      for (const listener of listeners) {
        listener.remove();
      }
    };
  }, []);

  const handleAndroidPermissionCheck = () => {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      ).then(result => {
        if (result) {
          console.log('Permission is OK');
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          ).then(result => {
            if (result) {
              console.log('User accept');
            } else {
              console.log('User refuse');
            }
          });
        }
      });
      
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
  const value = useMemo(() => ({ isScanning, peripherals,whPeripheral,
    receivedData,isConnected, startScan,togglePeripheralConnection,connectPeripheral,sendDataRPi
}), [isScanning,peripherals,receivedData,isConnected,whPeripheral])



return( <BLEContext.Provider value = {value}>
    {children}
     </BLEContext.Provider>
)
};

