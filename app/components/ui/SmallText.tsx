import { View, Text } from 'react-native'
import React, {FC} from 'react'
import { textStyles } from '../../style'

const SmallText:FC<{text:string, isCenter?: boolean}> = ({text, isCenter = false}) => {
  return (
    <View>
      <Text style={{...textStyles.smallText,textAlign: isCenter?"center":undefined}}>
        {text}
      </Text>
    </View>
  )
}

export default SmallText

//className={`flex-row items-end text-xl text-gray-800  pt-1 ${isCenter ? 'text-center': ''}`}