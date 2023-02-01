import React, { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../../hooks/useAuth'

import { Alert } from 'react-native'
import firestore from '@react-native-firebase/firestore'

export interface IProfile {
    _id:string
    displayName: string
    displaySurname:string
    displayWhModel:string
    displayRVoltage:string
    displayRCurrent:string
    displayManWeight:string
    docId: string
}
export const useProfile = () => {
    const {user} = useAuth()
    const [isLoading, setIsLoading] = useState(true)
    const [profile, setProfile] = useState<IProfile>({} as IProfile)
    const [name, setName] = useState('')
    const [surname,setSurname] = useState('')
    const [whModel,setWhModel] = useState('')
    const [rVoltage,setRVoltage] = useState('')
    const [rCurrent, setRCurrent] = useState('')
    const [manWeight,setManWeight] = useState('')



    useEffect(()=>{ firestore().collection('users').where('_id','==',user?.uid).limit(1).onSnapshot(
        snapshot =>{
            const profile = snapshot.docs.map(d => ({
                ...(d.data() as IProfile),
                docId: d.id
            }))[0]
            
            setProfile(profile)
            setName(profile.displayName)
            setSurname(profile.displaySurname)
            setRVoltage(profile.displayRVoltage)
            setRCurrent(profile.displayRCurrent)
            setWhModel(profile.displayWhModel)
            setManWeight(profile.displayManWeight)
            setIsLoading(false)
        }
    )

    },[])

    const value = useMemo(() => ({
        profile, isLoading, name, setName,surname,setSurname,whModel,setWhModel,rVoltage,setRVoltage,
        rCurrent,setRCurrent,manWeight,setManWeight
    }), [profile, isLoading, name, surname,whModel,rVoltage,rCurrent,manWeight])

    return value

}