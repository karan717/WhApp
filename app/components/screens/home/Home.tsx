import { View, Text } from 'react-native'
import React, { FC } from 'react'
import Header from './Header'
import Layout from '../../layout/Layout'

const Home:FC = () => {
  return (
    <Layout>
      <Header/>
      <Text>Home</Text>
    </Layout>
  )
}

export default Home