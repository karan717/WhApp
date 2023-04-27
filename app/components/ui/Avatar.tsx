import { View, Text } from 'react-native'
import React, { FC } from 'react'
import { textStyles } from '../../style'

interface IAvatar {
    name?: string | null
}

const Avatar:FC<IAvatar> = ({name='Max'}) => {
  return (
    <View style={textStyles.avatarContainer}>
      <Text style={textStyles.avatarText}>{name?.slice(0,1)}</Text>
    </View>
  )
}

export default Avatar