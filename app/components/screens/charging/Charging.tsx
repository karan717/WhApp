import { View, Text } from 'react-native'
import React, { FC } from 'react'
import Layout from '../../layout/Layout'
import BLECharging from './BLECharging'




const Charging:FC = () => {
  return (
    <Layout isScrollView={false}>
    
    <Text className='text-2xl text-center pt-10'>Scan for devices</Text>
    <BLECharging></BLECharging>
    
    </Layout>
   
  )
}

export default Charging