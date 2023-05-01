import { View, Text } from 'react-native'
import React from 'react'
import { aboutStyles } from "../../../style";

const CardComponent = ({inputText}:any) => {
  return (
    <View style = {aboutStyles.customCard}>
        <View style = {aboutStyles.cardRow1}>
            <Text style = {aboutStyles.cardText}>{inputText}</Text>
        </View>

        <View style = {aboutStyles.cardRow2}>
            <Text style = {aboutStyles.showMoreText}>+ Show More</Text>
        </View>
    </View>
  )
}

export default CardComponent