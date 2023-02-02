import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, { FC } from 'react'
import { IProfile, useProfile } from './useProfile'
import Heading from '../../ui/Heading'
import Layout from '../../layout/Layout'
import Loader from '../../ui/Loader'
import Field from '../../ui/Field'
import Button from '../../ui/Button'
import { useAuth } from '../../../hooks/useAuth'
import { useUpdateProfile } from './useUpdateProfile'
import { useNavigation } from '@react-navigation/native'
import Entypo from 'react-native-vector-icons/Entypo'
import FieldTitle from '../../ui/FieldTitle'

const Profile:FC = () => {
  const {logout} = useAuth()
  const {isLoading: isProfileLoading, name, setName,
    surname,setSurname, whModel,setWhModel,rCurrent,setRCurrent,rVoltage,
    setRVoltage,manWeight,setManWeight, profile} = useProfile()
  const {navigate} = useNavigation()

  const {isLoading, isSuccess,updateProfile} = useUpdateProfile(name, surname,whModel,rVoltage,rCurrent,
    manWeight, profile.docId)

  return (
    <Layout isScrollView={false}>
      <View>
        <TouchableOpacity 
        onPress={() => navigate('Home')}
        className='flex-row items-end'
        >
          <Entypo
          name = 'chevron-small-left'
          size={28}
          className = 'text-gray-800'
          />
          <Text className='text-2xl text-gray-800 font-bold'>Back</Text>
        </TouchableOpacity>

        <Heading text='Profile' isCenter={true}/>
      </View>
      <ScrollView className='px-4'>
        {isSuccess && (
          <View className='bg-green-500 p-3 py-2 rounded-lg'>
            <Text className='text-white text-center'>
              Profile Updated Successfully
            </Text>
          </View>
        )}
        {(isProfileLoading || isLoading) ? <Loader/> : <>
        <FieldTitle name="Name"/>
          <Field onChange={setName} val={name} 
          placeholder='Enter name' />

        <FieldTitle name="Family Name"/>
          <Field onChange={setSurname} val={surname} 
          placeholder='Enter family name' />

        <FieldTitle name="Battery Voltage (Max.) *"/>
          <Field onChange={setRVoltage} val={rVoltage} 
          placeholder='Enter battery voltage' />

        <FieldTitle name="Battery Current (Max.) *"/>
          <Field onChange={setRCurrent} val={rCurrent} 
          placeholder='Enter battery current' />

        <FieldTitle name="Wheelchair Model"/>
          <Field onChange={setWhModel} val={whModel} 
          placeholder='Enter wheelchair model' />

        <FieldTitle name="User Weight, lbs"/>
          <Field onChange={setManWeight} val={manWeight} 
          placeholder='Enter your weight' />



          <Button onPress={updateProfile} title='Update Profile'
          colors={['bg-yelllow-300','#FBBF24']}/>

          <Button onPress={logout} title='Logout'
          colors={['bg-gray-200','#D6D8DB']}/>
        </>}
      </ScrollView>
    </Layout>
  )
}

export default Profile