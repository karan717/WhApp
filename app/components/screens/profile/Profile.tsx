import { View, Text, TouchableOpacity } from 'react-native'
import React, { FC } from 'react'
import { useProfile } from './useProfile'
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
  const {isLoading: isProfileLoading, name, setName, profile} = useProfile()
  const {navigate} = useNavigation()

  const {isLoading, isSuccess,updateProfile} = useUpdateProfile(name, profile.docId)
  return (
    <Layout>
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
      <View className='px-4'>
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
          <Button onPress={updateProfile} title='Update Profile'
          colors={['bg-yelllow-300','#FBBF24']}/>

          <Button onPress={logout} title='Logout'
          colors={['bg-gray-200','#D6D8DB']}/>
        </>}
      </View>
    </Layout>
  )
}

export default Profile