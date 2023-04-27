import { Text, TouchableHighlight } from 'react-native'
import React, { FC } from 'react'
import { textStyles } from '../../style'
interface IButton{
    onPress: () => void
    title: string
    colors?: [string,string]

}
const Button:FC<IButton> = ({onPress,title,colors=['bg-yelllow-300','#FBBF24']}) => {
  return (
    <TouchableHighlight 
    onPress={onPress} 
    underlayColor={colors[1]}
    style={textStyles.buttonStyle}
    >
        <Text style={textStyles.buttonText}>
            {title}
        </Text>
    </TouchableHighlight>
  )
}

export default Button