import { View, Text, StyleSheet } from 'react-native'
import React, { FC } from 'react'
import NavItem from './NavItem'
import { menu } from './menu'
import { TypeRootStackParamList } from '../../../navigation/types'
import { footerStyles } from '../../../style'


interface IFooter{
    navigate: (screenName: keyof TypeRootStackParamList) => void
    currentRoute?: string
}

const Footer:FC<IFooter> = ({navigate, currentRoute}) => {
  return (
    <View style={footerStyles.footerContainer}>
      {menu.map(item =>(
        <NavItem 
        key={item.title} 
        item={item} 
        navigate={navigate}
        currentRoute={currentRoute}/>
      ))}
    </View>
  )
}

export default Footer