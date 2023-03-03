import { View, Text, TouchableHighlight, Alert } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import Header from './Header'
import Layout from '../../layout/Layout'
import * as Progress from 'react-native-progress';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { useBLE } from '../../../hooks/useBLE';
import Loader from '../../ui/Loader';

//#08F26E #86DC3D #5BC236
//<Text className='text-2xl text-center pt-40'>Home</Text>
//'bg-yelllow-300','#FBBF24'

const Home:FC = (props) => {
  const {navigate} = useNavigation()
  const {isScanning,peripherals,whPeripheral,isConnected,receivedData,sendDataRPi,startScan,connectPeripheral} = useBLE();
  const [timesToSearch,setTimesToSearch] = useState(5)
  useEffect(() => {
    const interval = setInterval(async() => {
      console.log('Home UseEffect')
      let runScan = whPeripheral!==undefined //runScan check if whPeripheral found
      console.log(!runScan)
      console.log(whPeripheral===undefined||Number(receivedData)===0)
      if(!runScan){
        await startScan()
        if(whPeripheral!==undefined){
          console.log('Home found')
        }
      }else{
        let whInstance = peripherals.get(whPeripheral.id);
        if(whInstance.connected){
          sendDataRPi('Start Charging',whPeripheral);
        }else{
          await connectPeripheral(whPeripheral)
          sendDataRPi('Start Charging',whPeripheral);
        }
        
      }
      console.log(timesToSearch)
      if(timesToSearch>0){
      setTimesToSearch(timesToSearch-1)
      }
    }, (timesToSearch>1&&(whPeripheral===undefined||Number(receivedData)===0))?2000:10000);
    return () => {
      clearInterval(interval);
      console.log('Unmount Home')
    };
  }, [whPeripheral,receivedData,isScanning,timesToSearch]);


  return (<>
    <Layout>

      <Header/>
      
      <View style={styles.container}>
        {timesToSearch>1&&Number(receivedData)===0&&<Loader/>}
        {timesToSearch<=1&&Number(receivedData)===0&&
        <>
          <Text>Couldn't find Wheelchair</Text>
          <TouchableHighlight 
            onPress={async ()=> {
              console.log(peripherals)
              console.log(typeof whPeripheral.id)
              if(whPeripheral===undefined){
                await startScan();
              }else
              {
                let whInstance = peripherals.get(whPeripheral.id);
                if(whInstance.connected){
                  sendDataRPi('Start Charging',whPeripheral);
                }else{
                  await connectPeripheral(whPeripheral)
                  sendDataRPi('Start Charging',whPeripheral);
                }
              }
              }} 
            underlayColor='#D6D8DB'
            className={`bg-green-500 text-gray-800 rounded-xl w-6/12 my-4 py-3`}>
            <Text className='text-center text-xl text-gray-800'>
                Scan Wheelchair
            </Text>
          </TouchableHighlight>
        </>}

        {Number(receivedData)>0&& <>        
        <Text style={styles.textBattery}>
          Battery Level
        </Text>
        <Progress.Bar progress={Number(receivedData)/100} width={200} height={90} color='#5BC236'/>
        <Text style={styles.text}>
          {Number(receivedData)+'%'}
        </Text>
        </> }

        {/* <Text style={styles.textBattery}>
          Battery Level
        </Text>
        <Progress.Bar progress={Number(receivedData)/100} width={200} height={90} color='#5BC236'/>
        <Text style={styles.text}>
          {Number(receivedData)+'%'}
        </Text> */}




        <TouchableHighlight 
          onPress={()=> navigate('Profile')} 
          underlayColor='#D6D8DB'
          className={`bg-green-500 text-gray-800 rounded-xl w-6/12 my-4 py-3`}>
          <Text className='text-center text-xl text-gray-800'>
              User Profile
          </Text>
        </TouchableHighlight>

        <TouchableHighlight 
          onPress={()=>{Alert.alert(
            'Do you want to upload the wheelchair data?',
          'The data on the wheelchair battery level and geolocation will be uploaded to a server. It helps to improve the routing capabilities of the app',
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
        }} 
          underlayColor='#D6D8DB'
          className={`bg-green-500 text-gray-800 rounded-xl w-6/12 my-4 py-3`}>
          <Text className='text-center text-xl text-gray-800'>
              Upload Data
          </Text>
        </TouchableHighlight>

        <Text className='text-center text-gray-800'>
          Last uploaded on 01/01/2023
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
    marginTop: 100,
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
    paddingBottom:80,
    color: "#1F2937",
  },
});

export default Home