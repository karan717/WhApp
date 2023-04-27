import { View, Text } from 'react-native'
import React, { FC } from 'react'
import { textStyles } from '../../style'

const FieldTitle:FC<{name:string}>= ({name}) => {
  return (
    <View>
      <Text style={textStyles.fieldTitle}>
        {name}
      </Text>
    </View>
  )
}

export default FieldTitle

//font-bold