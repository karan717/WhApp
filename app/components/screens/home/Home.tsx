import { View, Text, TouchableHighlight, Alert } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import Header from './Header'
import Layout from '../../layout/Layout'
import * as Progress from 'react-native-progress';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { useBLE } from '../../../hooks/useBLE';
import Loader from '../../ui/Loader';
import Button from '../../ui/Button';

//#08F26E #86DC3D #5BC236
//<Text className='text-2xl text-center pt-40'>Home</Text>
//'bg-yelllow-300','#FBBF24'
const Separator = () => <View style={styles.separator} />;

const Home:FC = (props) => {
  const {navigate} = useNavigation()
  const {isScanning,peripherals,whPeripheral,receivedBatteryLevel,sendDataRPi,startScan,connectPeripheral} = useBLE();
  const [timesToSearch,setTimesToSearch] = useState(5)
  useEffect(() => {
    const interval = setInterval(async() => {
      console.log('Home UseEffect')
      let runScan = whPeripheral!==undefined //runScan check if whPeripheral found
      console.log(!runScan)
      console.log(whPeripheral===undefined||Number(receivedBatteryLevel)===0)
      if(!runScan){
        await startScan()
        if(whPeripheral!==undefined){
          console.log('Home found')
        }
      }else{
        let whInstance = peripherals.get(whPeripheral.id);
        if(whInstance.connected){
          sendDataRPi('Battery Level',whPeripheral);
        }else{
          await connectPeripheral(whPeripheral)
          //sendDataRPi('Battery Level',whPeripheral);
        }
        
      }
      console.log(timesToSearch)
      if(timesToSearch>0){
      setTimesToSearch(timesToSearch-1)
      }
    }, (timesToSearch>1&&(whPeripheral===undefined||Number(receivedBatteryLevel)===0))?2000:10000);
    return () => {
      clearInterval(interval);
      console.log('Unmount Home')
      //console.log(peripherals)
    };
  }, [whPeripheral,receivedBatteryLevel,isScanning,timesToSearch]);

  function getColor(value:number) {
    //value from 0 to 1
    var hue = ((1 - value) * 120).toString(10);
    return ["hsl(", hue, ",100%,40%)"].join("");
  }
  const handleUploadData = () =>{
    Alert.alert(
      'Do you approve data upload?',
      'NOTE: Data includes users\' GPS history.',
      //'The data on the wheelchair battery level and geolocation will be uploaded to a server. It helps to improve the routing capabilities of the app',
    [
      {
        text: 'Cancel',
        onPress: () => Alert.alert('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Ok',
        onPress: () => Alert.alert('The data is uploaded'),
        style: 'destructive',
      }
    ],
    {
      cancelable: true,
      onDismiss: () =>
        Alert.alert(
          'Cancel Pressed',
        ),
    },)
  }

  const handleFindWheelchair = async () =>{
    console.log(peripherals)
    //console.log(typeof whPeripheral.id)
    //change the logic, when wheelchair is disconnected and whPeripheral!== undefined
    //this function doesnt start scanning
    if(whPeripheral===undefined){ 
      await startScan();
    }else
    {
      let whInstance = peripherals.get(whPeripheral.id);
      if(whInstance.connected){
        sendDataRPi('Battery Level',whPeripheral);
      }else{
        await connectPeripheral(whPeripheral)
        //sendDataRPi('Battery Level',whPeripheral);
      }
    }
  }


  return (<>
    
    <Layout isScrollView={true}>
    <Header/>
      
      
      <View style={styles.container}>
        {timesToSearch>1&&Number(receivedBatteryLevel)===0&&
        <>
        <Loader/>
        <Text className='text-center text-gray-800 text-xl'>Connecting to Wheelchair ...</Text>
        <View className='w-4/5'>
          <Separator />
        </View>
        </>
        
        }
        {timesToSearch<=1&&Number(receivedBatteryLevel)===0&&
        <>
          <Text className='text-center text-gray-800 text-xl'>Wheelchair not found</Text>
          <View className='w-4/5'>
            {isScanning&&<Loader/>}
            <Button title={isScanning ?'Searching...':'Connect to Wheelchair'} onPress={handleFindWheelchair} />
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

        {/* <Text style={styles.textBattery}>
          Battery Level
        </Text>
        <Progress.Bar progress={Number(receivedBatteryLevel)/100} width={200} height={90} color='#5BC236'/>
        <Text style={styles.text}>
          {Number(receivedBatteryLevel)+'%'}
        </Text> */}

        <View className='w-4/5'>
          <Button title='User Profile' onPress={()=> navigate('Profile')}/>
          <Separator />
          <Button title='Upload Data' onPress={handleUploadData} />
        </View>

        <Text className='text-center text-gray-800 text-xl'>
          Last upload: 01/01/2023
        </Text>

        

      </View>
      
    </Layout>
    
    </>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 20,
    marginTop: 20,
  },
  textBattery: {
    fontSize: 25,
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
  separator: {
    marginVertical: 15,
    borderBottomColor: '#1F2937',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default Home