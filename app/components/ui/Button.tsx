import { Text, TouchableHighlight } from 'react-native'
import React, { FC } from 'react'
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
    className={`bg-yellow-300 ${colors[0]} text-gray-800 rounded-xl w-full my-4 py-2`}>
        <Text className='text-gray-800 text-center text-2xl'>
            {title}
        </Text>
    </TouchableHighlight>
  )
}

export default Button