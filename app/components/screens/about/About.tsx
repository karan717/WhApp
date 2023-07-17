import { View, Text, TouchableOpacity } from "react-native";
import React, { FC, useState } from "react";
import { aboutStyles } from "../../../style";
import Layout from "../../layout/Layout";
import CardComponent from "./CardComponent";
import { moderateScale } from "../../../Metrics";

const About: FC = () => {
  const cardTitles = ["Our team", "Our mission", "How to use this App?", "How to contact us?"];
  const cardMoreInfo = [
    {MoreInfo: <Text style={aboutStyles.moreCardText}>Our team comprised of PhD students from NC State University. WhApp was developed by Zhansen Akhmetov. The full system is developed by Muhammad Abdelraziq, Ujjwal Pratik, Stephen Paul, and Shokoufeh Valadkhani.
    The advisor of the students is Dr. Zeljko Pantic.</Text>},
    {MoreInfo: <Text style={aboutStyles.moreCardText}>At the core of our mission is a commitment to enhancing the quality of life for those who use our product. 
      We strive to create solutions that are user-centered, intuitive, and easy to use. To achieve this goal, we collaborate closely with people who have personal and private medical conditions, taking their unique needs and perspectives into account throughout the development process.
      Through our commitment to user-centered design, we aim to make a meaningful impact on the lives of our users and their families. We believe that everyone deserves access to tools and technologies that make their lives easier and more fulfilling, and we are dedicated to making this vision a reality.
      </Text>},
    {MoreInfo: <Text style={aboutStyles.moreCardText}>To use the app, please follow these steps:
    {"\n"}{"\n"}1. Set up your profile: Click on the arrow located on the top left side of the screen and enter the maximum battery voltage and battery current of your wheelchair. This will help the app determine the most suitable charging options for your needs.
    {"\n"}{"\n"}2. Plan your route: To see the public chargers available on a map and plan your route, go to the Route page. This will display the charging stations closest to your location and their availability status. To plan the optimal route, select the nearest available charger, and on the screen appeared, press the button “Directions”. This will show the optimal route and the expected battery remaining at the end of the travel.
    {"\n"}{"\n"}3. Charge your wheelchair: When you have found a suitable public charger, go to the Charging page, and press the button labeled "Search for Chargers". The app will display a list of available chargers with their corresponding numbers. Select the charger that you want to use and plug it into your wheelchair.
    {"\n"}{"\n"}By following these steps, you should be able to easily find and use public charging stations for your wheelchair using the app. If you have any questions or issues, please refer to the app's help section or contact customer support for further assistance.
    </Text>},
    {MoreInfo: <Text style={aboutStyles.moreCardText}>
      Phone: +1 (999) 999 9999
      {"\n"}{"\n"}Email: aclwheelchair@gmail.com
      {"\n"}{"\n"}Address: 1791 Varsity Dr Ste 100, Raleigh, NC 27606
    </Text>}
  ];
  const [cardStatus,setCardStatus] = useState([false,false,false,false]);

  const handleShowMore = (index:number) =>{
    //console.log("show index",index)
    setCardStatus(prevState => prevState.map((item, idx) => idx === index ? !item : item))


  }
  //Whether you're a frequent traveler or just need to charge your wheelchair on the go, WhApp makes it easy to find the nearest charging station and plan the most efficient route. 
  //With features such as route planning, charging station availability, and user reviews, the app provides a comprehensive solution to help you navigate the world with greater ease and confidence.
  return (
    <Layout>
      <Text style = {aboutStyles.pageTitle}>About</Text>
      <Text style={aboutStyles.introText}>WhApp is a mobile application designed to help wheelchair users easily locate accessible public charging stations and plan optimal routes. With its user-friendly interface and intuitive design, the app provides real-time information about the location, availability, and accessibility of public charging stations in your area.

      </Text>
      <View style = {aboutStyles.cardContainer}>
        {cardTitles.map( (item,index) => {
          return (
          <TouchableOpacity 
          key={index} 
          onPress={()=>handleShowMore(index)}>
            <CardComponent inputText={item}/>
            {cardStatus[index] && 
            <View style={aboutStyles.moreInfoContainer}>
              <>
              {/* <Text>
                This is the info about ....
              </Text> */}
              {cardMoreInfo[index].MoreInfo}
              </>
            </View>
            }
            <View 
            //Separator between Cards, no margin when open and margin when closed
            style = {{marginBottom: cardStatus[index]?0:20*moderateScale(1)}}
            />
          </TouchableOpacity>
          )}
        )}

      </View>

    </Layout>
  );
};

export default About;
