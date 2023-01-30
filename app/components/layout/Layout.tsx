import { View, Text, ScrollView } from 'react-native'
import React, { FC } from 'react'

interface ILayout {
    isScrollView?: boolean
    children: React.ReactNode;
}

export const styleCenter = 'h-full w-full bg-white pt-16'

const Layout:FC<ILayout> = ({children,isScrollView = true}) => {
  return (
    <View className='h-full w-full bg-white pt-16'>
        {isScrollView ? <ScrollView>{children}</ScrollView> : children}
    </View>
  )
}

export default Layout