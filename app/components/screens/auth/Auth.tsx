import { View, Text, Pressable, Alert, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import React, { FC, useState } from 'react'
import { useAuth } from '../../../hooks/useAuth'
import Loader from '../../ui/Loader'
import Field from '../../ui/Field'
import Button from '../../ui/Button'
import { authStyles } from '../../../style'
import SmallText from '../../ui/SmallText'
import Heading from '../../ui/Heading'

interface IData {
  email:string
  password:string
}


const Auth:FC = () => {
  //Authorization Context
  const {isLoading,login,register} = useAuth()

  //Local states
  const [data, setData] = useState<IData>({} as IData)
  const [isReg, setIsReg] = useState(false)

  const authHandler = async () => {
    const {email, password} = data
    if(isReg) await register(email,password)
    else await login(email, password)

    setData({} as IData)
  }

  return (
    <View style={authStyles.layoutContainer}>
      <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      enabled={Platform.OS === "ios"} //disable this feature for android
      style={authStyles.keyboardContainer}
      >
        <ScrollView 
        contentContainerStyle={authStyles.scrollViewContainer}>
          <View style={authStyles.innerViewContainer}>
            <Image source={require('./img/Logo.png')}
            style={authStyles.logoStyle}/>
          

            <Heading text={isReg ? 'Sign Up': 'Sign In'} isMarginBottom={true}/>

            {isLoading ? <Loader/> :
            <>
              <Field 
              val={data.email} 
              placeholder='Enter email'
              onChange={val => setData({...data, email:val})}
              isCapitalized={false}
              />

              <Field 
              val={data.password} 
              placeholder='Enter password'
              onChange={val => setData({...data, password:val})}
              isSecure={true}
              isCapitalized={false}
              />

              <Button onPress={authHandler} title={isReg ? 'Sign Up': 'Sign In'} />

              <Pressable onPress={()=> setIsReg(!isReg)} style={authStyles.pressableStyle}>
                <SmallText text={isReg ? 'Login' : 'Register'} />
              </Pressable>
            </>
            }
          </View>
        </ScrollView>
        
        
        
      </KeyboardAvoidingView>
    </View>
  )
}

export default Auth