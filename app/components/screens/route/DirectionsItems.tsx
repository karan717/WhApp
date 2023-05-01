import { View, Text } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import { moderateScale } from "../../../Metrics";

const DirectionsItems = (props: any) => {
  return (
    <>
      <View style={styles.directionsItem1}>
        <Text style={styles.directionsText1}>{props.input[0]}</Text>
      </View>
      <View style={styles.directionsItem2}>
        <Text style={styles.directionsText2}>{props.input[1]}</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  directionsText1: {
    fontSize: 20*moderateScale(1),
    fontWeight: "400",
    marginBottom: 5*moderateScale(1),
  },
  directionsText2: {
    fontSize: 20*moderateScale(1),
    fontWeight: "500",
    marginBottom: 5*moderateScale(1),
  },
  directionsItem1: {
    width: "70%",
    paddingLeft: 30*moderateScale(1),
  },
  directionsItem2: {
    width: "30%",
  },
});

export default DirectionsItems;
