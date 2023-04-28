import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { FC } from "react";
import Avatar from "../../ui/Avatar";
import { useNavigation } from "@react-navigation/native";
import { useProfile } from "../profile/useProfile";
import Loader from "../../ui/Loader";
import Entypo from "react-native-vector-icons/Entypo";
import LargeText from "../../ui/LargeText";
import { moderateScale } from "../../../Metrics";

const Header: FC = () => {
  const { isLoading, name, whName } = useProfile();

  const { navigate } = useNavigation();

  return isLoading ? (
    <Loader />
  ) : (
    <View className="px-4 flex-row items-center">
      <Avatar name={whName != "" ? whName : name} />
      <TouchableOpacity
        onPress={() => navigate("Profile")}
        className="flex-row items-end"
      >
        <LargeText text={whName != "" ? whName : name + "'s Wheelchair"} />
        <Entypo
          name="chevron-small-right"
          size={28 * moderateScale(1)}
          className="text-gray-800"
        />
      </TouchableOpacity>
    </View>
  );
};

export default Header;

//This is header of the Home Page
