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
    isUploadingData,
    lastUploadDate,
    sendDataRPi,
    startScan,
    connectPeripheral,
  } = useBLE();
  const [timesToSearch, setTimesToSearch] = useState(1);
  //change useEffect of the Home
  useEffect(() => {
    const interval = setInterval(
      async () => {
        //console.log('is whPeripheral undefined?', whPeripheral === undefined )
        if (whPeripheral === undefined && timesToSearch>0){
          await startScan();
          setTimesToSearch(timesToSearch - 1);
          if(whPeripheral !== undefined){
            await connectPeripheral(whPeripheral); //
          }
        }else if(whPeripheral !== undefined ){
          setTimesToSearch(0); //if it is already found, don't need automatic search again
          let whInstance = peripherals.get(whPeripheral.id);
          //If wheelchair is not connected, then it will be deleted by sendDataRPi function call
          sendDataRPi("Battery Level", whPeripheral);
            
        }
        console.log(timesToSearch);
      },
      timesToSearch > 0 &&
        (whPeripheral === undefined)
        ? 1000 : 10000
    );
    return () => {
      clearInterval(interval);
      console.log("Unmount Home");
      //console.log(peripherals)
    };
  }, [whPeripheral, receivedBatteryLevel, isScanning, timesToSearch, isUploadingData, lastUploadDate]);

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
      //It can never work, because startScan is asynchronous function,
      //it should be handled inside the handle Discover function
      if(whPeripheral !== undefined){
        await connectPeripheral(whPeripheral); //
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
  };

  return (
    <>
      <View style={homeStyles.layoutContainer}>
        <Header />

        <View style={homeStyles.outerContainer}>
          <ScrollView contentContainerStyle={homeStyles.scrollViewContainer}>
            <View style={homeStyles.innerViewContainer}>

              {
                //Text when the wheelchair is not found or searching for it
                isNaN(parseInt(receivedBatteryLevel)) && (
                  <>
                    
                    {isScanning ? <>
                    <Loader />
                    <SmallText text="Connecting to Wheelchair..." />
                    </> : <SmallText text="Wheelchair not found" />}
                    <View style={homeStyles.buttonViewContainer}>
                      
                      <Separator />
                      <Button
                        title={
                          isScanning ? "Searching..." : "Connect to Wheelchair"
                        }
                        onPress={()=>{
                          handleFindWheelchair();
                          setTimesToSearch(0); //if pressed, no need for automatic search
                        }}
                        isDisabled={isScanning}
                      />
                      <Separator />
                    </View>
                  </>
                )
              }

              {
                //Battery Level when the wheelchair is found
                !isNaN(parseInt(receivedBatteryLevel)) && (
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
                      {Number(receivedBatteryLevel).toFixed(1) + "%"}
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
                <Button title={isUploadingData?"Uploading...":"Upload Data"} onPress={handleUploadData} isDisabled={isUploadingData} />
              </View>

              <SmallText text={`Last upload: ${lastUploadDate===''?'No uploads yet':lastUploadDate}`} />
            </View>
          </ScrollView>
        </View>
      </View>
    </>
  );
};

export default Home;
