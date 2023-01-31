import { View, Text } from 'react-native'
import React, { FC } from 'react'

const FieldTitle:FC<{name:string}>= ({name}) => {
  return (
    <View>
      <Text className='flex-row items-end text-xl text-gray-800 font-bold'>
        {name}
      </Text>
    </View>
  )
}

export default FieldTitle