import React, { useState } from 'react'
import { useAuth } from '../../../hooks/useAuth'
import firestore from '@react-native-firebase/firestore'
import { Alert } from 'react-native'

export const useUpdateProfile = (name: string, docId:string) => {
    const {user} = useAuth()

    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const updateProfile = async () => {
        setIsLoading(true)

        if(!user) return

        try {
            await firestore().collection('users').doc(docId).update({
                displayName: name,
            })

            setIsSuccess(true)
            
            setTimeout(() => {
                setIsLoading(false)

            },3000)
            
        } catch (error:any) {
            Alert.alert('Error update profile',error.message)
            
        } finally {
            setIsLoading(false)
        }


        
    }
    return {isLoading,updateProfile,isSuccess}

}