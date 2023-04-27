import { TextInput } from 'react-native'
import React, { FC } from 'react'
import { textStyles } from '../../style'

interface IField{
    //children: React.ReactNode;
    onChange: (val:string)=> void
    val: string
    placeholder: string
    isSecure?:boolean    
    isNumeric?:boolean
    isCapitalized?:boolean
}

const Field :FC<IField>= ({onChange,placeholder,val,isSecure,isNumeric,isCapitalized=true}) => {
  return (
    <TextInput
    showSoftInputOnFocus={true}
    placeholder={placeholder}
    onChangeText={onChange}
    value={val}
    secureTextEntry={isSecure}
    autoCapitalize={isCapitalized?'sentences':'none'}
    placeholderTextColor="#888"
    keyboardType={isNumeric?'numeric':'default'}
    style={textStyles.field}
    />
  )
}

export default Field