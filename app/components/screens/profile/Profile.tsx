import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import React, { FC } from "react";
import { IProfile, useProfile } from "./useProfile";
import Heading from "../../ui/Heading";
import Layout from "../../layout/Layout";
import Loader from "../../ui/Loader";
import Field from "../../ui/Field";
import Button from "../../ui/Button";
import { useAuth } from "../../../hooks/useAuth";
import { useUpdateProfile } from "./useUpdateProfile";
import { useNavigation } from "@react-navigation/native";
import Entypo from "react-native-vector-icons/Entypo";
import FieldTitle from "../../ui/FieldTitle";
import LargeText from "../../ui/LargeText";
import { verticalScale, moderateScale } from "../../../Metrics";
import { profileStyles } from "../../../style";

const Profile: FC = () => {
  const { logout } = useAuth();
  const {
    isLoading: isProfileLoading,
    name,
    setName,
    surname,
    setSurname,
    WhID,
    setWhID,
    whModel,
    setWhModel,
    rCurrent,
    setRCurrent,
    rVoltage,
    setRVoltage,
    manWeight,
    setManWeight,
    whName,
    setWhName,
    profile,
  } = useProfile();
  const { navigate } = useNavigation();

  const { isLoading, isSuccess, updateProfile } = useUpdateProfile(
    name,
    surname,
    WhID,
    whModel,
    rVoltage,
    rCurrent,
    manWeight,
    whName,
    profile.docId
  );

  return (
    <Layout isScrollView={false}>
      <View>
        <TouchableOpacity
          onPress={() => navigate("Home")}
          className="flex-row items-end"
        >
          <Entypo
            name="chevron-small-left"
            size={28 * moderateScale(1)}
            className="text-gray-800"
          />
          <LargeText text="Back" />
        </TouchableOpacity>

        <Heading text="Profile" isCenter={true} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        //keyboardVerticalOffset={10}
        enabled={Platform.OS === "ios"} //disable this feature for android
      >
        <ScrollView
          contentContainerStyle={profileStyles.scrollViewContainer}
          keyboardDismissMode="on-drag"
        >
          {isSuccess && (
            <View style={profileStyles.isSuccessContainer}>
              <Text style={profileStyles.isSuccessText}>
                Profile Updated Successfully
              </Text>
            </View>
          )}

          {isProfileLoading || isLoading ? (
            <Loader />
          ) : (
            <>
              <FieldTitle name="First Name" />
              <Field onChange={setName} val={name} placeholder="First Name" />

              <FieldTitle name="Last Name" />
              <Field
                onChange={setSurname}
                val={surname}
                placeholder="Last Name"
              />

              <FieldTitle name="Wheelchair ID *" />
              <Field
                onChange={setWhID}
                val={WhID}
                placeholder="Wheelchair ID: 123456"
                isSecure={true}
                isNumeric={true}
              />

              <FieldTitle name="Wheelchair Name" />
              <Field
                onChange={setWhName}
                val={whName}
                placeholder="Wheelchair Name"
              />

              <FieldTitle name="Wheelchair Model" />
              <Field
                onChange={setWhModel}
                val={whModel}
                placeholder="Enter wheelchair model"
              />

              <FieldTitle name="Battery Voltage (Max.) *" />
              <Field
                onChange={setRVoltage}
                val={rVoltage}
                placeholder="Battery Voltage (Volts)"
                isNumeric={true}
              />

              <FieldTitle name="Battery Current (Max.) *" />
              <Field
                onChange={setRCurrent}
                val={rCurrent}
                placeholder="Battery Current (Amps)"
                isNumeric={true}
              />

              <FieldTitle name="User Weight, lbs" />
              <Field
                onChange={setManWeight}
                val={manWeight}
                placeholder="User Weight (lbs)"
                isNumeric={true}
              />

              <Button onPress={updateProfile} title="Update Profile" />

              <View
                style={{
                  paddingBottom:
                    Platform.OS === "ios"
                      ? 90 * Math.round(verticalScale(1))
                      : 0,
                }}
              >
                <Button
                  onPress={logout}
                  title="Logout"
                  colors={["#E5E7EB", "#D6D8DB"]}
                />
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Layout>
  );
};

export default Profile;
