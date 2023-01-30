import { View, Text } from 'react-native'
import React, { FC } from 'react'
import { useProfile } from './useProfile'
import Heading from '../../ui/Heading'
import Layout from '../../layout/Layout'
import Loader from '../../ui/Loader'
import Field from '../../ui/Field'
import Button from '../../ui/Button'
import { useAuth } from '../../../hooks/useAuth'
import { useUpdateProfile } from './useUpdateProfile'

const Profile:FC = () => {
  const {logout} = useAuth()
  const {isLoading: isProfileLoading, name, setName, profile} = useProfile()

  const {isLoading, isSuccess,updateProfile} = useUpdateProfile(name, profile.docId)
  return (
    <Layout>
      <Heading text='Profile' isCenter={true}/>
      <View className='px-4'>
        {isSuccess && (
          <View className='bg-green-500 p-3 py-2 rounded-lg'>
            <Text className='text-white text-center'>
              Profile Updated Successfully
            </Text>
          </View>
        )}
        {(isProfileLoading || isLoading) ? <Loader/> : <>
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