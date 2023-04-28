import { View, Text } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";

const DirectionsItems = (props: any) => {
  return (
    <>
      <View style={styles.workingHourItem1}>
        <Text style={styles.workingHoursText1}>{props.input[0]}</Text>
      </View>
      <View style={styles.workingHourItem2}>
        <Text style={styles.workingHoursText2}>{props.input[1]}</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  workingHoursText1: {
    fontSize: 20,
    fontWeight: "400",
    marginBottom: 5,
  },
  workingHoursText2: {
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 5,
  },
  workingHourItem1: {
    width: "70%",
    paddingLeft: 30,
  },
  workingHourItem2: {
    width: "30%",
  },
});

export default DirectionsItems;
