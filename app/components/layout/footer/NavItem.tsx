import { View, Text, Pressable, StyleSheet } from 'react-native'
import React, { FC } from 'react'
import { IFooterItem } from './types'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { TypeRootStackParamList } from '../../../navigation/types'

interface INavItem{
    item: IFooterItem
    navigate: (screenName: keyof TypeRootStackParamList) => void
    currentRoute?: string
}

const NavItem:FC<INavItem> = ({item,navigate, currentRoute}) => {
    const isActive = currentRoute === item.title
  return (
    <Pressable style = {styles.container} onPress={() => navigate(item.title)}>
        <AntDesign name={item.iconName} 
            color={isActive?'#3B82F6':'#6B7280'}
            size={20}
        />
        <Text className={`text-sm ${isActive ? 'text-blue-500' : 'text-gray-500'}`}>
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
    text:{
        marginTop: 1,
    }
})

export default NavItem