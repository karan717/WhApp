import { Text, TouchableHighlight } from 'react-native'
import React, { FC } from 'react'
import { textStyles } from '../../style'
interface IButton{
    onPress: () => void
    title: string
    colors?: [string,string]

}
const Button:FC<IButton> = ({onPress,title,colors=['#FCD34D','#FBBF24']}) => {
  return (
    <TouchableHighlight 
    onPress={onPress} 
    underlayColor={colors[1]}
    style={{...textStyles.buttonStyle,backgroundColor: colors[0]}}
    >
        <Text style={textStyles.buttonText}>
            {title}
        </Text>
    </TouchableHighlight>
  )
}

export default Button