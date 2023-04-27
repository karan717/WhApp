import { View, Text, Pressable, StyleSheet } from 'react-native'
import React, { FC } from 'react'
import { IFooterItem } from './types'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import { TypeRootStackParamList } from '../../../navigation/types'
import { moderateScale } from '../../../Metrics'
import { footerStyles } from '../../../style'

interface INavItem{
    item: IFooterItem
    navigate: (screenName: keyof TypeRootStackParamList) => void
    currentRoute?: string
}

const NavItem:FC<INavItem> = ({item,navigate, currentRoute}) => {
    const isActive = currentRoute === item.title
  return (
    <Pressable style = {styles.container} onPress={() => navigate(item.title)}>
        {item.iconName!='battery'?
        <AntDesign name={item.iconName} 
            color={isActive?'#3B82F6':'#6B7280'}
            size={27*moderateScale(1)}
        />:
        <Entypo name={item.iconName} 
            color={isActive?'#3B82F6':'#6B7280'}
            size={27*moderateScale(1)}
        />}
        <Text style={{...footerStyles.footerText,color: isActive ? "#3B82F6" : "#6B7280"}}>
            {item.title}
        </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
    container:{
        width: '20%',
        alignItems: "center",
        display: "flex",
    },
})

export default NavItem

//className={`text-sm ${isActive ? 'text-blue-500' : 'text-gray-500'}`}