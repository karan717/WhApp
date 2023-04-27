import { View, Text } from 'react-native'
import React, {FC} from 'react'
import { textStyles } from '../../style'

const Heading:FC<{text:string, isCenter?: boolean, isMarginBottom?:boolean}> = ({text, isCenter = false,isMarginBottom = false}) => {
  return (
    <View className='px-4'>
      <Text style={{...textStyles.headingText,marginBottom: isMarginBottom ? 4 : 0,textAlign: isCenter ? "center" : undefined }}>{text}</Text>
    </View>
  )
}

export default Heading

//className={`text-3xl font-bold text-gray-800 ${isCenter ? 'text-center': ''} ${marginBottom ? 'mb-2': ''}`}