import { View, Text, TouchableHighlight } from 'react-native'
import React, { FC } from 'react'
import Header from './Header'
import Layout from '../../layout/Layout'
import * as Progress from 'react-native-progress';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'

//#08F26E #86DC3D #5BC236
//<Text className='text-2xl text-center pt-40'>Home</Text>
const Home:FC = () => {
  const {navigate} = useNavigation()
  return (
    <Layout>
      <Header/>
      
      <View style={styles.container}>
        <Text style={styles.textBattery}>
          Battery Level
        </Text>
        <Progress.Bar progress={0.3} width={200} height={90} color='#5BC236'/>
        <Text style={styles.text}>
          {0.3*100+'%'}
        </Text>

        <TouchableHighlight 
          onPress={()=> navigate('Profile')} 
          underlayColor='#D6D8DB'
          className={`bg-green-500 text-gray-800 rounded-xl w-6/12 my-4 py-3`}>
          <Text className='text-center text-xl text-gray-800'>
              User Profile
          </Text>
        </TouchableHighlight>
        <TouchableHighlight 
          onPress={()=>{}} 
          underlayColor='#D6D8DB'
          className={`bg-green-500 text-gray-800 rounded-xl w-6/12 my-4 py-3`}>
          <Text className='text-center text-xl text-gray-800'>
              Upload Data
          </Text>
        </TouchableHighlight>
      </View>
    </Layout>
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