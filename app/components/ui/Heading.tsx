import { View, Text } from 'react-native'
import React, {FC} from 'react'

const Heading:FC<{text:string, isCenter?: boolean}> = ({text, isCenter = false}) => {
  return (
    <View className='px-4'>
      <Text className={`text-2xl font-bold text-gray-800 ${isCenter ? 'text-center': ''}`}>{text}</Text>
    </View>
  )
}

export default Heading