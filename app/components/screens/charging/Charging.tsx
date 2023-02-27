import { View, Text } from 'react-native'
import React, { FC } from 'react'
import BLEScreen from '../BLEScreen'
import Layout from '../../layout/Layout'




const Charging:FC = () => {
  return (
    <Layout isScrollView={false}>
    
    <Text className='text-2xl text-center pt-10'>Charging</Text>
    <BLEScreen></BLEScreen>
    
    </Layout>
   
  )
}

export default Charging