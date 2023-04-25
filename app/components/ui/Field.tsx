import { TextInput } from 'react-native'
import React, { FC } from 'react'
import EStyleSheet from 'react-native-extended-stylesheet'

interface IField{
    //children: React.ReactNode;
    onChange: (val:string)=> void
    val: string
    placeholder: string
    isSecure?:boolean    
    isNumeric?:boolean
}

const Field :FC<IField>= ({onChange,placeholder,val,isSecure,isNumeric}) => {
  return (
    <TextInput
    showSoftInputOnFocus={true}
    placeholder={placeholder}
    onChangeText={onChange}
    value={val}
    secureTextEntry={isSecure}
    autoCapitalize='sentences'
    placeholderTextColor="#888"
    keyboardType={isNumeric?'numeric':'default'}
    //className='text-lg rounded-xl bg-gray-100 mt-3 p-3 w-full'
    style={styles.field}
    />
  )
}

const styles = EStyleSheet.create({
  field:{
    padding: "0.5rem",
    marginTop: "0.5rem",
    backgroundColor: "#F3F4F6",
    fontSize: "1.625rem",
    lineHeight: "2rem",
    width: "100%",
    borderRadius: "0.75rem",
    marginBottom: "0.75rem",
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
    
  }
})

export default Field