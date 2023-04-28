import { Alert } from "react-native";
import React, { useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { useAuth } from "../../../hooks/useAuth";
import { useBLE } from "../../../hooks/useBLE";

//Important link on Firestore usage for React Native
//https://rnfirebase.io/firestore/usage

export const useUploadPath = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { receivedBatteryLevel } = useBLE();

  const uploadPath = async (elevations: any, docId: string) => {
    setIsLoading(true);

    if (!user) return;

    try {
      //Creates the document with the ID the same as user ID
      //Updates the document if it already exists
      await firestore()
        .collection("paths")
        .doc(user.uid)
        .set(
          {
            _id: user.uid,
            points: elevations,
            currentSoC:
              Number(receivedBatteryLevel) > 0
                ? Number(receivedBatteryLevel)
                : 80,
          },
          { merge: true }
        );

      setIsSuccess(true);

      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    } catch (error: any) {
      Alert.alert("Error update profile", error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return { isLoading, uploadPath, isSuccess };
};
