import { View, Text } from 'react-native'
import React, { FC } from 'react'

interface IAvatar {
    name?: string | null
    size?: 'small' | 'large'
}

const Avatar:FC<IAvatar> = ({name='Max',size = 'small'}) => {
  const isSmall = size==='small'
  return (
    <View className = {`rounded-full bg-gray-300 ${isSmall ? 'w-11 h-11 mr-3':'w-14 h-14 mr-3'} items-center justify-center`}>
      <Text className={`text-white ${isSmall ? 'text-2xl' : 'text-3xl'} font-medium`}>{name?.slice(0,1)}</Text>
    </View>
  )
}

export default Avatar