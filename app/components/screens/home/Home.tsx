import {
  View,
  Text,
  TouchableHighlight,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { FC, useEffect, useState } from "react";
import Header from "./Header";
import Layout from "../../layout/Layout";
import * as Progress from "react-native-progress";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useBLE } from "../../../hooks/useBLE";
import Loader from "../../ui/Loader";
import Button from "../../ui/Button";
import { homeStyles } from "../../../style";
import SmallText from "../../ui/SmallText";
import { useAuth } from "../../../hooks/useAuth";

//#08F26E #86DC3D #5BC236
//<Text className='text-2xl text-center pt-40'>Home</Text>
//'bg-yelllow-300','#FBBF24'
const Separator = () => <View style={homeStyles.separator} />;

const Home: FC = (props) => {
  const { user } = useAuth(); //user.uid for data upload
  const { navigate } = useNavigation();
  const {
    isScanning,
    peripherals,
    whPeripheral,
    receivedBatteryLevel,
    sendDataRPi,
    startScan,
    connectPeripheral,
  } = useBLE();
  const [timesToSearch, setTimesToSearch] = useState(5);
  //change useEffect of the Home
  useEffect(() => {
    const interval = setInterval(
      async () => {
        console.log("Home UseEffect");
        let runScan = whPeripheral !== undefined; //runScan check if whPeripheral found
        console.log(!runScan); //false
        console.log(
          whPeripheral === undefined || Number(receivedBatteryLevel) === 0
        ); //true...
        if (!runScan) {
          await startScan();
          if (whPeripheral !== undefined) {
            console.log("Home found");
          }
        } else {
          let whInstance = peripherals.get(whPeripheral.id);
          if (whInstance.connected) {
            sendDataRPi("Battery Level", whPeripheral);
          } else {
            await connectPeripheral(whPeripheral);
            //sendDataRPi('Battery Level',whPeripheral);
          }
        }
        console.log(timesToSearch);
        if (timesToSearch > 0) {
          setTimesToSearch(timesToSearch - 1);
        }
      },
      timesToSearch > 1 &&
        (whPeripheral === undefined || Number(receivedBatteryLevel) === 0)
        ? 2000
        : 10000
    );
    return () => {
      clearInterval(interval);
      console.log("Unmount Home");
      //console.log(peripherals)
    };
  }, [whPeripheral, receivedBatteryLevel, isScanning, timesToSearch]);

  function getColor(value: number) {
    //value from 0 to 1
    var hue = ((1 - value) * 120).toString(10);
    return ["hsl(", hue, ",100%,40%)"].join("");
  }
  const handleUploadData = () => {
    Alert.alert(
      "Do you approve data upload?",
      "NOTE: Data includes users' GPS history.",
      //'The data on the wheelchair battery level and geolocation will be uploaded to a server. It helps to improve the routing capabilities of the app',
      [
        {
          text: "Cancel",
          onPress: () => Alert.alert("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Ok",
          onPress: () => {
            if (whPeripheral!==undefined) {
            sendDataRPi(`Upload_${user?.uid}_Stop`,whPeripheral)
            }else{
              Alert.alert("Wheelchair is not connected")
            }
          },
          style: "destructive",
        },
      ],
      {
        cancelable: true,
        onDismiss: () => Alert.alert("Cancel Pressed"),
      }
    );
  };

  const handleFindWheelchair = async () => {
    console.log(peripherals);
    //console.log(typeof whPeripheral.id)
    //change the logic, when wheelchair is disconnected and whPeripheral!== undefined
    //this function doesnt start scanning
    if (whPeripheral === undefined) {
      await startScan();
    } else {
      let whInstance = peripherals.get(whPeripheral.id);
      if (whInstance.connected) {
        sendDataRPi("Battery Level", whPeripheral);
      } else {
        await connectPeripheral(whPeripheral);
        //sendDataRPi('Battery Level',whPeripheral);
      }
    }
  };

  return (
    <>
      <View style={homeStyles.layoutContainer}>
        <Header />

        <View style={homeStyles.outerContainer}>
          <ScrollView contentContainerStyle={homeStyles.scrollViewContainer}>
            <View style={homeStyles.innerViewContainer}>
              {
                //Text at the very beginning when trying to connect to battery (5 times)
                timesToSearch > 1 && Number(receivedBatteryLevel) === 0 && (
                  <>
                    <Loader />

                    <SmallText text="Connecting to Wheelchair..." />

                    <View style={homeStyles.buttonViewContainer}>
                      <Separator />
                    </View>
                  </>
                )
              }

              {
                //Text when the battery is not found after 5 times
                timesToSearch <= 1 && Number(receivedBatteryLevel) === 0 && (
                  <>
                    <SmallText text="Wheelchair not found" />
                    <View style={homeStyles.buttonViewContainer}>
                      {isScanning && <Loader />}
                      <Button
                        title={
                          isScanning ? "Searching..." : "Connect to Wheelchair"
                        }
                        onPress={handleFindWheelchair}
                      />
                      <Separator />
                    </View>
                  </>
                )
              }

              {
                //Battery Level when the wheelchair is found
                Number(receivedBatteryLevel) > 0 && (
                  <>
                    <Text style={homeStyles.textBattery}>WC Battery Level</Text>

                    <Progress.Bar
                      progress={Number(receivedBatteryLevel) / 100}
                      width={180}
                      height={70}
                      color={getColor(1 - Number(receivedBatteryLevel) / 100)}
                      borderWidth={1}
                      borderColor="#000000"
                    />

                    <Text style={homeStyles.textBattery}>
                      {Number(receivedBatteryLevel) + "%"}
                    </Text>

                    <View style={homeStyles.buttonViewContainer}>
                      <Separator />
                    </View>
                  </>
                )
              }

              <View style={homeStyles.buttonViewContainer}>
                <Button
                  title="User Profile"
                  onPress={() => navigate("Profile")}
                />
                <Separator />
                <Button title="Upload Data" onPress={handleUploadData} />
              </View>

              <SmallText text="Last upload: 01/01/2023" />
            </View>
          </ScrollView>
        </View>
      </View>
    </>
  );
};

export default Home;

/*

<Layout isScrollView={false}>
      <Header/>
      <View style={homeStyles.container}>
        <ScrollView contentContainerStyle={homeStyles.scrollViewContainer}>
          <View style={homeStyles.innerViewContainer}>
            <Text>Hello World</Text>
          </View>
        </ScrollView>
      </View>
    </Layout>
    
*/
