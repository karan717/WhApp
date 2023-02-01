
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth'
import React, {createContext, FC, useEffect, useMemo, useState} from 'react'
import { Alert } from 'react-native'
import { register, login, logout } from '../firebase'
import firestore from '@react-native-firebase/firestore'

interface IContext {
    user: FirebaseAuthTypes.User | null
    isLoading: boolean
    register: (email:string, password: string) => Promise<void>
    login: (email:string, password: string) => Promise<void>
    logout: () => Promise<void>
}

interface Props {
    children: React.ReactNode;
}


export const AuthContext = createContext<IContext>({} as IContext)

export const AuthProvider: FC<Props> =  ({children})  => {

    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null)
    const [isLoadingInitial, setIsLoadingInitial] = useState(true)
    const [isLoading, setIsLoading] = useState(false)

    const registerHandler = async (email:string, password: string) =>{
        setIsLoading(true)
        try{
            const {user} = await register(email, password)
            

            await firestore().collection('users').add({
                _id: user.uid,
                displayName: 'No name',
            })
        }catch (error:any) {
            Alert.alert('Error reg:', error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const loginHandler = async(email:string, password: string) => {
        setIsLoading(true)
        try{
            await login(email, password)
    
        }catch (error:any) {
            Alert.alert('Error login:', error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const logoutHandler = async() => {
        setIsLoading(true)
        try{
            await logout()
    
        }catch (error:any) {
            Alert.alert('Error logout:', error.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => auth().onAuthStateChanged( user => {
        setUser(user)
        setIsLoadingInitial(false)
    }),[])

    const value = useMemo(() =>({
        user, isLoading, login: loginHandler, logout: logoutHandler, register: registerHandler
    }),[user, isLoading])

    return( <AuthContext.Provider value = {value}>
        {!isLoadingInitial && children}
         </AuthContext.Provider>
    )

}