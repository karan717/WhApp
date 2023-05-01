import { View, Text, TouchableOpacity } from "react-native";
import React, { FC, useState } from "react";
import { aboutStyles } from "../../../style";
import Layout from "../../layout/Layout";
import CardComponent from "./CardComponent";
import { moderateScale } from "../../../Metrics";

const About: FC = () => {
  const cardTitles = ["More about our team", "How to use this App?", "How to contact us?", "About our mission"];
  const cardMoreInfo = [
    {MoreInfo: <Text>Hello1</Text>},
    {MoreInfo: <Text>Hello2</Text>},
    {MoreInfo: <Text>Hello3</Text>},
    {MoreInfo: <Text>Hello4</Text>}
  ];
  const [cardStatus,setCardStatus] = useState([false,false,false,false]);

  const handleShowMore = (index:number) =>{
    //console.log("show index",index)
    setCardStatus(prevState => prevState.map((item, idx) => idx === index ? !item : item))


  }
  return (
    <Layout>
      <Text style = {aboutStyles.pageTitle}>About us</Text>
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
              <Text>
                This is the info about ....
              </Text>
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
