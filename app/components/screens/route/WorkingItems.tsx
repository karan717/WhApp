import { View, Text } from 'react-native'
import React from 'react'
import { StyleSheet } from 'react-native';

const WorkingItems = (props:any) => {
  return (
    <>
        <View style={styles.workingHourItem1} ><Text style={styles.workingHoursText}>{props.input[0]+'y'}</Text></View>
        <View style={styles.workingHourItem2} ><Text style={styles.workingHoursText}>{(props.input[1]).substring(1)}</Text></View>
    </>
  )
}


const styles = StyleSheet.create({
    workingHoursText: {
        fontSize: 17,
        fontWeight:"400",
        marginBottom:10,
      },
    workingHourItem1:{
      width: '50%',
      paddingLeft:30,
    },
    workingHourItem2:{
      width: '50%',
    },
   });

export default WorkingItems