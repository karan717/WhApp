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



export const BLEProvider: FC<Props> =  ({children})  => {
  const [isScanning, setIsScanning] = useState(false); //Scanning for BLE devices Wheelchair or Chargers
  const [peripherals, setPeripherals] = useState(new Map()); //all peripherals
  const [whPeripheral, setWhPeripheral] = useState<Object | any>() //Wheelchair peripheral only
  const [receivedData, setReceivedData] = useState(''); //Received Data from chargers
  const [receivedBatteryLevel, setReceivedBatteryLevel] = useState(''); //Received Battery Level from Wheelchair
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
  //console.log({peripherals: peripherals.entries()});

  const updatePeripherals = (key:any, value:any) => {
    _setPeripherals(new Map(peripherals.set(key, value)));
  };
  const deletePeripheral = (key:any) => {
    if(peripherals.delete(key)){
      console.log('deleted, new periphera:',peripherals)
      _setPeripherals(new Map(peripherals));
    }
  }

  const startScan = async () => {
    if (!isScanning) {
      try {
        console.log('Scanning...');
        //console.log('beofre scanning',peripherals.values().next().value)
        //Clean all non connected chargers and wheelchair first... and then do scanning??
        //Clean the whPeripheral too if it is not connected...?
        //This will help to remove the old chargers that are not nearby anymore
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
    //console.log('Peripherals found',peripherals)
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
    let whPeripheral = whPeripheralRef.current; // so that listener accesses the latest whPeripheral object
    let peripherals = peripheralsRef.current; // so that listener accese the latest peripherals map

    //console.log(whPeripheral!==undefined && data.peripheral===whPeripheral.id)
    //differentiate between message from wheelchair and charger
    console.log('received msg',outData)
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
        setReceivedBatteryLevel(outData)
      }
    }else{
      setReceivedData(outData) //message from charger
      //charger is busy, disconnected
      if(outData === 'Charger Busy'){
        Alert.alert('Charger is currently unavailable, come later')
        togglePeripheralConnection(peripherals.get(data.peripheral))
      }
      //Alert.alert(outData)
      //plug in your wheelchair
      if(outData === 'Await Battery'){
        Alert.alert('Plug In your unit, charger is awaiting battery connection')
      }
      //
      if(outData === 'In Progress'){
        Alert.alert('Charging in Progress')
      }
      //battery is faulty, unplug
      if(outData === 'Faulty Battery'){
        Alert.alert('Unplug your unit, battery is faulty')
      }
      //Plugged Faulty Charger
      if(outData === 'Plugged Fault'){
        Alert.alert('Unplug your unit, charger is faulty')
      }
      //Unplugged Faulty Charger
      if(outData === 'Faulty Charger'){
        Alert.alert('Do not plug in, charger is faulty')
        togglePeripheralConnection(peripherals.get(data.peripheral))
      }
      //disconnected 
      if(outData === 'Disconnect'){
        Alert.alert('Disconnected from the charger')
        togglePeripheralConnection(peripherals.get(data.peripheral))
      }
      //Fully Charged
      if(outData === 'Fully Charged'){
        Alert.alert('Unplug your unit, battery is fully charged')
      }
      //Send back to charger to let know that App is connected through Bluetooth
      if(outData === 'Check BLE'){
        sendDataRPi('Connected',peripherals.get(data.peripheral))
      }

    }
  };
  

  const handleDiscoverPeripheral = (peripheral:any) => {
    if(peripheral.advertising.localName){ //if peripheral has local name then check
      //To access the latest peripherals state, the reference hook is required
      //https://medium.com/geographit/accessing-react-state-in-event-listeners-with-usestate-and-useref-hooks-8cceee73c559
      let peripherals = peripheralsRef.current;
      


      if(peripheral.advertising.localName.substring(0,7)=='ACL-Ch-'||peripheral.advertising.localName.substring(0,13)=='ACL-Wh-'+WhIDRef.current){
        console.log('discovered per',peripherals.get(peripheral.id))
        console.log(WhIDRef.current) //Use here useRef to get WhIDRef.current
        if(peripherals.get(peripheral.id)===undefined || !peripherals.get(peripheral.id).connected){
          console.log('discovered inside',peripheral)
          peripheral.advertising.localName.substring(0,7)=='ACL-Ch-' && updatePeripherals(peripheral.id, {...peripheral,...{connecting: false, connected: false}});
          peripheral.advertising.localName.substring(0,7)=='ACL-Wh-' && updatePeripherals(peripheral.id, {...peripheral,...{connecting: false, connected: false}});
          peripheral.advertising.localName.substring(0,7)=='ACL-Wh-' && _setWhPeripheral(peripheral);

        }
      }

    }
  };

  const togglePeripheralConnection = async (peripheral:any) => {
    if (peripheral && peripheral.connected) {
      await sendDataRPi('Disconnecting',peripheral); //send message to charger
      await BleManager.disconnect(peripheral.id);
      setIsConnected(false)
      console.log('toggle disconnect')
    } else {
      if(whPeripheral===undefined || peripheral.id!==whPeripheral.id){
        if(parseInt(rCurrentRef.current)&&parseInt(rVoltageRef.current)){
          connectPeripheral(peripheral);
          console.log('toggle connect') 
        }else{
          Alert.alert("Rated Voltage or Current is not given")
        }
      }else{
        connectPeripheral(peripheral);
        console.log('toggle connect')   
      }           
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
        await BleManager.startNotification(peripheralUUID, service, characteristic).then(()=>{
          //If peripheral is connecting to the charger (Not Wheelchair)
          if(whPeripheral===undefined || peripheral.id!==whPeripheral.id){
            sendDataRPi(`${WhIDRef.current}:${rCurrentRef.current}:${rVoltageRef.current}:10:@`,peripheral)
          }
          //If peripheral is connecting to Wheelchair, immediately request for Battery Level
          if(whPeripheral!==undefined && peripheral.id===whPeripheral.id){
            sendDataRPi(`Battery Level`,peripheral)
          }
        });
        markPeripheral({connecting: false, connected: true});
        setIsConnected(true)
        console.log('Peripheral connected')
        // //If peripheral is connecting to the charger (Not Wheelchair)
        // if(whPeripheral===undefined || peripheral.id!==whPeripheral.id){
        //   await sendDataRPi(`${WhID}:9:29:22:@`,peripheral)
        // }
        // //If peripheral is connecting to Wheelchair, immediately request for Battery Level
        // if(whPeripheral!==undefined && peripheral.id===whPeripheral.id){
        //   await sendDataRPi(`Battery Level`,peripheral)
        // }mongodb+srv://wheelchair:wheelchair@cluster0.pywpd.mongodb.net/test

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
    console.log('data to send',data)
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
        console.log('error during sending?',error);
        setIsConnected(false);
        setReceivedBatteryLevel(''); // if wheelchair turned off suddenly, then do not show the battery level anymore
        markPeripheral({connecting: false, connected: false});


        //Delete the Wheelchair peripheral if it can not send the data that means that the connection is lost between
        //RPi and App and using the same peripheral details can not connect them again if connection is lost
        if(whPeripheralRef.current !== undefined && whPeripheralRef.current.id===peripheral.id){ //if it is wheelchair, delete it
          deletePeripheral(peripheral.id) //delete the peripheral, it means this peripheral is off...
          _setWhPeripheral(undefined)
        }
        //It is safe to delete and find again if it is for some reason lost the connection
      });

      function markPeripheral(props:any) {
        updatePeripherals(peripheral.id, {...peripheral, ...props});
      }



  }

  useEffect(() => {
    handleAndroidPermissionCheck();
    if (Platform.OS === 'android' && Platform.Version >= 23){
      //turn on the bluetooth if off
      BleManager.enableBluetooth().then(() => {
        console.log('Bluetooth is turned on!');
      });
    }

    BleManager.start({showAlert: false});

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
          //so that it can be found by BLE
          if(whPeripheralRef!==undefined){
            console.log('whPeripheralRefCurrent is undefined')
            if(whPeripheralRef.current!==undefined){
              if(whPeripheralRef.current.advertising.localName.substring(0,13)=='ACL-Wh-'+profile.displayWhID){
                console.log('matches')
              }else{
                console.log('doesnt match')
                deletePeripheral(whPeripheralRef.current.id)
                _setWhPeripheral(undefined)
                console.log(whPeripheralRef)
                setReceivedBatteryLevel('0')
              }

            }
          }else{
            console.log('whPeripheralRef is undefined')
          }
          _setWhID(profile.displayWhID)
          _setRParams(profile.displayRCurrent, profile.displayRVoltage)
          if(isUploadingData && lastUploadDate!==profile.lastUploadDate){
            setIsUploadingData(false)
            Alert.alert('Data is uploaded successfully') //If no connection with BLE
            //Make in wheelchair the code that updates the lastUploadDate of the user according to _id
          }
          setLastUploadDate(profile.lastUploadDate)
          console.log('Update upload time',profile.lastUploadDate)
          console.log('succesfully updated',profile.displayWhID)
      }, error => {
        console.log(error)
      }
      )
    } catch(error){
        console.log(error)
    }


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

