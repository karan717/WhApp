import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { FC } from 'react'
import Avatar from '../../ui/Avatar'
import { useNavigation } from '@react-navigation/native'
import { useProfile } from '../profile/useProfile'
import Loader from '../../ui/Loader'

const Header:FC = () => {
  const {isLoading, name} = useProfile()
  const {navigate} = useNavigation()

  return isLoading ? <Loader/> : (
    <View className = 'px-4 flex-row items-center'>
      <Avatar name='Zhansen'/>
      <TouchableOpacity 
      onPress={() => navigate('Profile')}
      className='flex-row items-end'
      >
        <Text className='text-2xl text-gray-800 font-bold'>{name}</Text>

      </TouchableOpacity>
    </View>
  )
}


export default Header