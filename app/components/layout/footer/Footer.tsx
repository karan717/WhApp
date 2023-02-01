import { View, Text, StyleSheet } from 'react-native'
import React, { FC } from 'react'
import NavItem from './NavItem'
import { menu } from './menu'
import { TypeRootStackParamList } from '../../../navigation/types'


interface IFooter{
    navigate: (screenName: keyof TypeRootStackParamList) => void
    currentRoute?: string
}

const Footer:FC<IFooter> = ({navigate, currentRoute}) => {
  return (
    <View style={styles.container}>
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



const styles = StyleSheet.create({
    container:{
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: "#F9FAFB",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        borderTopColor: '#E1E1E1',
        borderTopWidth: 1,

    }
})

export default Footer