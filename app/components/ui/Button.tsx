import { Text, TouchableHighlight } from 'react-native'
import React, { FC } from 'react'
import { PRESSED_YELLOW_BUTTON_COLOR, textStyles, YELLOW_BUTTON_COLOR } from '../../style'

interface IButton{
    onPress: () => void
    title: string
    colors?: [string,string]
    isDisabled?: boolean

}
const Button:FC<IButton> = ({onPress,title,colors=[YELLOW_BUTTON_COLOR,PRESSED_YELLOW_BUTTON_COLOR],isDisabled=false}) => {
  return (
    <TouchableHighlight 
    onPress={onPress} 
    underlayColor={colors[1]}
    style={{...textStyles.buttonStyle,backgroundColor: colors[0]}}
    disabled = {isDisabled}
    >
        <Text style={textStyles.buttonText}>
            {title}
        </Text>
    </TouchableHighlight>
  )
}

export default Button