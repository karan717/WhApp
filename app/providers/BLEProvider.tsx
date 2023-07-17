import React, {useState, useEffect, useMemo, FC, createContext, useRef} from 'react';
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
import { useAuth } from '../hooks/useAuth';
import firestore from '@react-native-firebase/firestore'
import { IProfile } from '../components/screens/profile/useProfile';

interface BLEContext {
    isScanning: boolean
    peripherals: Map<any,any>
    whPeripheral: any | string
    receivedData: string
    receivedBatteryLevel: string
    isConnected: boolean
    isUploadingData: boolean
    lastUploadDate: string
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

/* IMPORTANT NOTICE */
//All handle.... functions should use useRef hook to access the current state of the component
//Otherwise, it will access the old states that are set during the last mount of the component
//Moreover, the functions that are called inside the handle functions should use useRef hook!
//Otherwise, the same way simple functions will be referring to the older state
//SEE MORE INFO USING THE LINK BELOW
//https://medium.com/geographit/accessing-react-state-in-event-listeners-with-usestate-and-useref-hooks-8cceee73c559

export const BLEProvider: FC<Props> =  ({children})  => {
  const [isScanning, setIsScanning] = useState(false); //Scanning for BLE devices Wheelchair or Chargers
  const [peripherals, setPeripherals] = useState(new Map()); //all peripherals {...peripherals,...{connected:boolean,connecting:boolean}}
  const [whPeripheral, setWhPeripheral] = useState<Object | any>() //Wheelchair peripheral only
  const [receivedData, setReceivedData] = useState(''); //Received Data from chargers
  const [receivedBatteryLevel, setReceivedBatteryLevel] = useState('Not Received'); //Received Battery Level from Wheelchair
  const [isConnected, setIsConnected] = useState(false);
  const [isUploadingData, setIsUploadingData] = useState(false); // is Wheelchair Uploading data
  const [lastUploadDate, setLastUploadDate] = useState('loading...');
  const peripheralsRef = useRef<Map<any,any>>(peripherals); //For Discover Peripherals Listener to access the latest state rather than the first render state
  const _setPeripherals = (newPeripherals:any) =>{
    peripheralsRef.current = newPeripherals;
    setPeripherals(newPeripherals)
  }
  const whPeripheralRef = useRef<any>(whPeripheral);
  const _setWhPeripheral = (newWhPeripheral:any) =>{
    whPeripheralRef.current = newWhPeripheral;
    setWhPeripheral(newWhPeripheral);
  }
  //Obtaining the latest rCurrent and rVoltage from the Database
  const [rCurrnet, setRCurrent] = useState('');
  const [rVoltage, setRVoltage] = useState('');

  const rCurrentRef = useRef<string>(rCurrnet);
  const rVoltageRef = useRef<string>(rVoltage);

  const _setRParams = (newRCurrent:string, newRVoltage:string) =>{
    rCurrentRef.current = newRCurrent;
    rVoltageRef.current = newRVoltage;
    setRCurrent(newRCurrent);
    setRVoltage(newRVoltage);
  }

  //Obtaining the latest Wheelchair ID from the Database
  const [WhID, setWhID] = useState('');

  const WhIDRef = useRef<string>(WhID);
  const _setWhID = (newWhID:string) =>{
    WhIDRef.current = newWhID;
    setWhID(newWhID)
  }

  const {user} = useAuth();

  const updatePeripherals = (key:any, value:any) => {
    //peripheralsRef.current is used because this function is called 
    //from handleDiscoverPeripheral listener
    _setPeripherals(new Map(peripheralsRef.current.set(key, value)));
  };

  const deletePeripheral = (key:any) => {
    if(peripheralsRef.current.delete(key)){

      //If deleted peripheral is a wheelchair, then set the whPeripheralRef to undefined
      if(whPeripheralRef.current !== undefined && whPeripheralRef.current.id===key){
        _setWhPeripheral(undefined)
      }
      //Set the new peripheral
      _setPeripherals(new Map(peripheralsRef.current));
    }
  }

  const deleteUnconnectedPeripherals = () =>{
    for (let [key, value] of peripheralsRef.current){
      if(!value.connected){
        deletePeripheral(key);
      }
    }
  }

  const startScan = async () => {
    if (!isScanning) {
      try {
        setIsScanning(true);
        //Clean all non connected chargers and wheelchair first
        //This will help to remove the old chargers that are not nearby anymore
        deleteUnconnectedPeripherals();
        await BleManager.scan(SERVICE_UUIDS, SECONDS_TO_SCAN_FOR, ALLOW_DUPLICATES);
      } catch (error) {
        console.error(error);
      }
    }
  };

  /* 
  START HANDLE FUNCTIONS
  Handle functions that should use useRef hook to access the current state of the component
  */

  //Called when BLE scan is stopped
  const handleStopScan = () => {
    setIsScanning(false);
  };

  //Called when one of the peripherals is disconnected
  const handleDisconnectedPeripheral = (data:any) => {
    let peripheral = peripheralsRef.current.get(data.peripheral);
    if (peripheral) {
      peripheral.connected = false;
      updatePeripherals(peripheral.id, peripheral);
    }
  };

  //Handle received messages from BLE peripheral (receiver)
  const handleUpdateValueForCharacteristic = (data:any) => {
    let outData = Utf8ArrayToStr(data.value) //Byte to String
    let whPeripheral = whPeripheralRef.current; // so that listener accesses the latest whPeripheral object
    let peripherals = peripheralsRef.current; // so that listener accese the latest peripherals map

    //If the message is received from the Wheelchair RPi
    if(whPeripheral!==undefined && data.peripheral==whPeripheral.id){
      if(outData === 'Start Upload'){
        setIsUploadingData(true); //start Loader, otherwise don't start
      }
      if(outData === 'Uploaded'){
        Alert.alert('Data is successfully uploaded')
        setIsUploadingData(false)
      }
      if(outData === 'Not uploaded'){
        Alert.alert('Data is not uploaded! Try later.')
        setIsUploadingData(false)
      }
      const isNum = !isNaN(parseInt(outData));
      if(isNum){
        //setReceivedBatteryLevel(outData)
        if(parseInt(outData)>100){
          setReceivedBatteryLevel('100')
        }else if (parseInt(outData)<0){
          setReceivedBatteryLevel('0')
        }else{
          setReceivedBatteryLevel(outData)
          //setReceivedBatteryLevel("78.7")
        }
      }
    }else{ //If the message is received from the Charger RPi
      setReceivedData(outData) //message from charger

      //CHARGER IS BUSY (other BLE is connected)
      if(outData === 'Charger Busy'){
        Alert.alert('Charger is currently unavailable, come later')
        togglePeripheralConnection(peripherals.get(data.peripheral))
      }
      //AWAITING BATTERY CONNECTION STATE
      if(outData === 'Await Battery'){
        Alert.alert('Plug In your unit, charger is awaiting battery connection')
      }
      //CHARGING IN PROGRESS, PLUGGED
      if(outData === 'In Progress'){
        Alert.alert('Charging in Progress')
      }
      //FULLY CHARGED, PLUGGED
      if(outData === 'Fully Charged'){
        Alert.alert('Unplug your unit, battery is fully charged')
      }
      //BATTERY IS FAULTY, PLUGGED
      if(outData === 'Faulty Battery'){
        Alert.alert('Unplug your unit, battery is faulty')
      }
      //FAULTY CHARGER, PLUGGED
      if(outData === 'Plugged Fault'){
        Alert.alert('Unplug your unit, charger is faulty')
      }
      //FAULTY CHARGER, UNPLUGGED
      if(outData === 'Faulty Charger'){
        Alert.alert('Do not plug in, charger is faulty')
        togglePeripheralConnection(peripherals.get(data.peripheral))
      }
      //Charger RPi asks to Disconnect
      if(outData === 'Disconnect'){
        Alert.alert('Disconnected from the charger')
        togglePeripheralConnection(peripherals.get(data.peripheral))
      }
      //Send back to charger to let know that App is connected through Bluetooth
      if(outData === 'Check BLE'){
        sendDataRPi('Connected',peripherals.get(data.peripheral))
      }

    }
  };
  
  //Handle discovered peripherals from BLE scan
  const handleDiscoverPeripheral = (peripheral:any) => {
    if(peripheral.advertising.localName){ //if peripheral has local name then check
      //To access the latest peripherals state, the reference hook is required
      let peripherals = peripheralsRef.current;
      //is CHARGER or WHEELCHAIR peripheral
      if(peripheral.advertising.localName.substring(0,7)=='ACL-Ch-'||peripheral.advertising.localName.substring(0,13)=='ACL-Wh-'+WhIDRef.current){
        if(peripherals.get(peripheral.id)===undefined || !peripherals.get(peripheral.id).connected){
          //DISCOVERED PERIPHERAL is CHARGER
          peripheral.advertising.localName.substring(0,7)=='ACL-Ch-' && updatePeripherals(peripheral.id, {...peripheral,...{connecting: false, connected: false}});
          //DISCOVERED PERIPHERAL is WHEELCHAIR
          peripheral.advertising.localName.substring(0,7)=='ACL-Wh-' && updatePeripherals(peripheral.id, {...peripheral,...{connecting: false, connected: false}});
          peripheral.advertising.localName.substring(0,7)=='ACL-Wh-' && _setWhPeripheral(peripheral);
          peripheralsRef.current.get(peripheral.id)!==undefined && 
          peripheral.advertising.localName.substring(0,7)=='ACL-Wh-' 
          && connectPeripheral(whPeripheralRef.current);
        }
      }
    }
  };

  /* END HANDLE FUNCTIONS */

  //Connect or Disconnect peripherals (used only with CHARGER)
  const togglePeripheralConnection = async (peripheral:any) => {
    if (peripheral && peripheral.connected) {
      //Error, may occur, because while sending it can disconnect,
      //maybe we should add wait time after? However, the RPi receives the message immediately,
      //there is no time to receive acknowledgement only
      //CHECK AGAIN
      await sendDataRPi('Disconnecting',peripheral); //send message to charger
      await BleManager.disconnect(peripheral.id);
      setIsConnected(false)
    } else {
      //If Charger RPi
      if(whPeripheral===undefined || peripheral.id!==whPeripheral.id){
        if(parseInt(rCurrentRef.current)&&parseInt(rVoltageRef.current)){
          connectPeripheral(peripheral);
        }else{
          Alert.alert("Rated Voltage or Current is not given")
        }
      }else{ //If Wheelchair RPi
        connectPeripheral(peripheral);  
      }           
    }
  };

  

  const connectPeripheral = async (peripheral:any) => {
    // CONSTANTS DETERMINED inside RPi code
    const service = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E" //writing service
    const characteristic = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E" //reading characteristic UUID
    try {
      //peripheral.id is in try catch statement, just in case, if peripheral doesn't exist
      const peripheralUUID = peripheral.id;

      markPeripheral({connecting: true});

      //Connect to peripheral
      await BleManager.connect(peripheralUUID).then(() =>{
        markPeripheral({connecting: false, connected: true});
        setIsConnected(true);
        console.log('Peripheral connected');
      }).catch( (error) =>{
        console.log("Connection error is:",error);
        //delete the peripheral from the peripherals map...
        deletePeripheral(peripheral.id);
        
      });

      // Before startNotification you need to call retrieveServices
      await BleManager.retrieveServices(peripheralUUID).catch((error) => {
        console.log('Retrieve service error',error)
      });

      // To enable BleManagerDidUpdateValueForCharacteristic listener (start reading from BLE peripheral, receiver activation)
      await BleManager.startNotification(peripheralUUID, service, characteristic).then(()=>{
        //If peripheral is connecting to the Charger RPi (Not Wheelchair), immediately send data
        if(whPeripheral===undefined || peripheral.id!==whPeripheral.id){
          sendDataRPi(`${user?.uid}:${Number(rCurrentRef.current).toFixed(0)}:${Number(rVoltageRef.current).toFixed(0)}:10:@`,peripheral)
        }
        //If peripheral is connecting to Wheelchair RPi, immediately request for Battery Level
        if(whPeripheral!==undefined && peripheral.id===whPeripheral.id){
          sendDataRPi(`Battery Level`,peripheral)
        }
      }).catch((error) => {
        console.log('Start Notification error',error)
      });
    } catch (error) {
      console.log('Connection error', error);
    }
    //updating connected, connecting state of peripherals
    function markPeripheral(props:any) {
      updatePeripherals(peripheral.id, {...peripheral, ...props});
      
    }
  };

  //Send Data to BLE peripherals (transmitter)
  async function sendDataRPi(data:string,peripheral:any) {
    const peripheralUUID = peripheral.id;
    const service = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
    const characteristic = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E"; //writing char UUID
    const dataS = toUTF8Array(data); //string to byte array

    await BleManager.write(peripheralUUID, service, characteristic,dataS)
      .then(() => {})
      .catch((error) => {
        // Failure code
        console.log('error during sending?',error);
        setIsConnected(false);

        //If the peripheral is Charger RPi, set the charger as not connected
        markPeripheral({connecting: false, connected: false});

        //If the peripheral is Wheelchair RPi
        //Delete the Wheelchair peripheral if it can not send the data that means that the connection is lost between
        //RPi and App and using the same peripheral details can not connect them again if connection is lost
        //However, don't delete charger peripherals if not able to send messages, because during the process it can have 
        //the unsent messages due to timeout or etc.
        //if it is wheelchair, delete it
        if(whPeripheralRef.current !== undefined && whPeripheralRef.current.id===peripheral.id){ 
          setReceivedBatteryLevel('Not Received'); // if wheelchair turned off suddenly, then do not show the battery level anymore
          deletePeripheral(peripheral.id) //delete the peripheral, it means this peripheral is off...
        }
      });

      function markPeripheral(props:any) {
        updatePeripherals(peripheral.id, {...peripheral, ...props});
      }
  }

  useEffect(() => {
    //Ask for the BLE permission
    handleAndroidPermissionCheck();
    if (Platform.OS === 'android' && Platform.Version >= 23){
      //turn on the bluetooth if off
      BleManager.enableBluetooth().then(() => {
        console.log('Bluetooth is turned on!');
      });
    }

    BleManager.start({showAlert: false});

    //CHECK AGAIN, do we need unsubscriber function?
    try{
      //Subscribe to user Profile to see changes
      firestore().collection('users').where('_id','==',user?.uid).limit(1).onSnapshot(
      snapshot =>{
        const profile = snapshot.docs.map(d => ({
            ...(d.data() as IProfile),
            docId: d.id
        }))[0]
        
        //Check if the changed value of ID matches the current value
        //if it doesn't match, then make the whPeripheral empty
        //so that new Wheelchair can be found by BLE scanner again
        if(whPeripheralRef!==undefined && whPeripheralRef.current!==undefined){
          if(whPeripheralRef.current.advertising.localName.substring(0,13)=='ACL-Wh-'+profile.displayWhID){
            //matches wheelchair
          }else{
            //New Wheelchair ID is entered
            deletePeripheral(whPeripheralRef.current.id)
            _setWhPeripheral(undefined)
            setReceivedBatteryLevel('Not Received')
          }
        }

        //Set new Wheelchair ID
        _setWhID(profile.displayWhID)
        _setRParams(profile.displayRCurrent, profile.displayRVoltage)
        if(isUploadingData && lastUploadDate!==profile.lastUploadDate){
          setIsUploadingData(false)
          Alert.alert('Data is successfully uploaded') //If no connection with BLE
          //Make in wheelchair the code that updates the lastUploadDate of the user according to _id
        }
        setLastUploadDate(profile.lastUploadDate)
      }, error => {
        //console.log(error)
      }
      )
    } catch(error){
        console.log(error)
    }

    //BLE Listeners
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
      for (const listener of listeners) {
        listener.remove();
      }
    };
  }, [user]);

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
    receivedData,receivedBatteryLevel,isConnected, isUploadingData, lastUploadDate, startScan,togglePeripheralConnection,connectPeripheral,sendDataRPi
}), [isScanning,peripherals,receivedData,receivedBatteryLevel,isConnected,whPeripheral,isUploadingData, lastUploadDate])



return( <BLEContext.Provider value = {value}>
    {children}
     </BLEContext.Provider>
)
};

