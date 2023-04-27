import { View, Text } from 'react-native'
import React, {FC} from 'react'
import { textStyles } from '../../style'

const LargeText:FC<{text:string, isCenter?: boolean, isMarginBottom?:boolean}> = ({text, isCenter = false,isMarginBottom = false}) => {
  return (
    <View>
      <Text style={{...textStyles.largeText,marginBottom: isMarginBottom ? 4 : 0,textAlign: isCenter ? "center" : undefined }}>{text}</Text>
    </View>
  )
}

export default LargeText

//className={`text-3xl font-bold text-gray-800 ${isCenter ? 'text-center': ''} ${marginBottom ? 'mb-2': ''}`}