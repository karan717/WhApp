import { Platform, StyleSheet } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { verticalScale, horizontalScale, moderateScale } from "./Metrics";
import { Colors } from "react-native/Libraries/NewAppScreen";

const guidelineBaseWidth = 375; //375
const guidelineBaseHeight = 812; //812

/* Colors */

const BLUE_TEXT_COLOR = "#1F2937"; //#1F2937, main Text color
export const YELLOW_BUTTON_COLOR = "#FCD34D"; //#FCD34D, main button color
export const PRESSED_YELLOW_BUTTON_COLOR = "#FBBF24"; //main button pressed color
export const AVAILABLE_CHARGER_COLOR = "#029F0F"; //#029F0F  #299617main charger vector color
export const BUSY_CHARGER_COLOR = "#F6DE16"; //color of the charger vector and texts (yellow)
export const CLOSED_PLACE_COLOR = "#FF0000"; //Color of the text writing closed (red)

/*Style for main Layout of the app (backgroundColor white, otherwise it is default grey) */

export const layoutStyle = EStyleSheet.create({
  container: {
    paddingTop: verticalScale(1) * 50,
    backgroundColor: "#ffffff",
    width: "100%",
    height: "100%",
  },
});

/*   Styles for Auth Page   */
//Choose the shorter side of the screen
let logoSize =
  verticalScale(1) > horizontalScale(1) ? horizontalScale(1) : verticalScale(1);
export const authStyles = EStyleSheet.create({
  layoutContainer: {
    backgroundColor: "#ffffff",
    width: "100%",
    height: "100%",
  },
  keyboardContainer: {
    flex: 1,
    paddingTop: 60 * logoSize,
    marginBottom: 60 * logoSize,
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  innerViewContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft:
      horizontalScale(1) > 1.5
        ? horizontalScale(1) * guidelineBaseWidth * 0.15
        : horizontalScale(1) * guidelineBaseWidth * 0.1,
    marginRight:
      horizontalScale(1) > 1.5
        ? horizontalScale(1) * guidelineBaseWidth * 0.15
        : horizontalScale(1) * guidelineBaseWidth * 0.1,
    //for larger screens it will have 15% margin from each side, while for smaller screens it will have 10%
  },
  logoStyle: {
    width: 300 * logoSize,
    height: 220 * logoSize,
    marginBottom: 40 * logoSize,
  },
  pressableStyle: {
    marginLeft: "auto",
  },
});

/*   Styles for Footer   */

export const footerStyles = EStyleSheet.create({
  footerContainer: {
    paddingLeft: 5 * moderateScale(1),
    paddingRight: 5 * moderateScale(1),
    paddingTop: 20 * verticalScale(1),
    paddingBottom: 20 * verticalScale(1),
    backgroundColor: "#F9FAFB",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    borderTopColor: "#E1E1E1",
    borderTopWidth: 1 * verticalScale(1),
  },
  footerText: {
    //color: "#3B82F6", blue
    //color: "#6B7280", gray
    fontSize: `${0.875 * moderateScale(1)}rem`,
    lineHeight: `${1.25 * moderateScale(1)}rem`,
  },
});

/* Styles for Home page */

export const homeStyles = EStyleSheet.create({
  layoutContainer: {
    backgroundColor: "#ffffff",
    width: "100%",
    height: "100%",
    paddingTop: verticalScale(1) * 50,
  },
  outerContainer: {
    flex: 1,
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  innerViewContainer: {
    justifyContent: "center",
    alignItems: "center",
    //marginLeft: horizontalScale(1)>1.5 ? horizontalScale(1)*guidelineBaseWidth*0.15:horizontalScale(1)*guidelineBaseWidth*0.1,
    //marginRight: horizontalScale(1)>1.5 ? horizontalScale(1)*guidelineBaseWidth*0.15:horizontalScale(1)*guidelineBaseWidth*0.1,
    //for larger screens it will have 15% margin from each side, while for smaller screens it will have 10%
  },
  buttonViewContainer: {
    width: `${100 - 20 * horizontalScale(1)}%`,
  },
  textBattery: {
    fontSize: 25 * moderateScale(1),
    textAlign: "center",
    margin: 10,
    color: BLUE_TEXT_COLOR,
  },
  separator: {
    marginVertical: 15 * verticalScale(1),
    borderBottomColor: BLUE_TEXT_COLOR,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

/* Style for Profile page */
export const profileStyles = EStyleSheet.create({
  isSuccessContainer: {
    padding: `${0.75 * moderateScale(1)}rem`,
    paddingTop: `${0.5 * moderateScale(1)}rem`,
    paddingBottom: `${0.5 * moderateScale(1)}rem`,
    backgroundColor: "#10B981",
    borderRadius: "0.5rem",
  },
  isSuccessText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: `${0.9 * moderateScale(1)}rem`,
  },
  scrollViewContainer: {
    paddingLeft: `${
      horizontalScale(1) > 1.5 ? 2 * horizontalScale(1) : 1 * horizontalScale(1)
    }rem`,
    paddingRight: `${
      horizontalScale(1) > 1.5 ? 2 * horizontalScale(1) : 1 * horizontalScale(1)
    }rem`,
  },
});

/*   Styles for Route page  */

export const routeStyles = EStyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,

    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  containerClearButton: {
    position: "absolute",
    left: `${87+horizontalScale(1)*2}%`,
    alignItems: "flex-end",
    marginTop: 15*moderateScale(1),
    paddingRight: 10*moderateScale(1),
    width: `${13-horizontalScale(1)*2}%`,
    //borderWidth:0.5,
  },
  detailsContainer: {
    paddingHorizontal: 15*horizontalScale(1),
  },
  buttonContainer: {
    paddingHorizontal: 70*horizontalScale(1),
  },
  nameText: {
    fontSize: 20*moderateScale(1),
    fontWeight: "400",
  },
  infoTitleText: {
    fontSize: 17*moderateScale(1),
    fontWeight: "400",
    marginBottom: 10,
  },
  infoListContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  statusText: {
    fontSize: 16*moderateScale(1),
  },
});

/*   Styles for Charging page  */

const boxShadow = {
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
};

export const chargingStyles = EStyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginTop: 20*verticalScale(1),
    paddingTop: 20*verticalScale(1),
  },
  peripheralName: {
    fontSize: 20*moderateScale(1),
    textAlign: "center",
    paddingVertical: 20*moderateScale(1),
    paddingHorizontal: 80*moderateScale(1),
  },
  peripheralId: {
    fontSize: 12*moderateScale(1),
    textAlign: "center",
    padding: 2*moderateScale(1),
    paddingBottom: 20*moderateScale(1),
  },
  row: {
    marginLeft: 10*horizontalScale(1),
    marginRight: 10*horizontalScale(1),
    borderRadius: 20,
    ...boxShadow,
  },
  textBattery: {
    fontSize: 25*moderateScale(1),
    textAlign: "center",
    margin: 10*moderateScale(1),
    color: "#1F2937",
  },
  textBattery2: {
    fontSize: 20*moderateScale(1),
    textAlign: "center",
    margin: 10*moderateScale(1),
    color: "#1F2937",
  },
  text: {
    fontSize: 25*moderateScale(1),
    textAlign: "center",
    margin: 10*moderateScale(1),
    color: "#1F2937",
  },
  separator: {
    marginVertical: 15*verticalScale(1),
    borderBottomColor: "#1F2937",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

/*   Styles for About page  */

export const aboutStyles = EStyleSheet.create({
  pageTitle: {
    paddingTop: 10*moderateScale(1),
    fontSize: 25*moderateScale(1),
    lineHeight: 25*moderateScale(1),
    textAlign: "center",
    fontWeight: 'bold',
  },
  cardContainer: {
    justifyContent:"center",
    alignItems:"center",
    marginTop: 25*verticalScale(1),

  },
  customCard: {
    width:"90%",
    //justifyContent:"center",
    //borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: "#e0dee0", //YELLOW_BUTTON_COLOR,//"#e0dee0", //"#F3F4F6"
    shadowColor: Colors.SHADOW_COLOR,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    //marginBottom: 15*moderateScale(1),
  },
  cardRow1: {
    //borderWidth:1,
    width: "70%",
  },
  cardText: {
    padding: 10*moderateScale(1),
    fontSize: 20*moderateScale(1),
    lineHeight: 25*moderateScale(1),
    textAlign: "left",    
  },
  cardRow2: {
    //borderWidth:1,
    width: "30%",
  },
  showMoreText: {
    padding: 5*moderateScale(1),
    fontSize: 15*moderateScale(1),
    lineHeight: 20*moderateScale(1),
    textAlign: "right",
    textDecorationLine: 'underline',    
  },
  moreInfoContainer: {
    width:"90%",
    backgroundColor: "white",
    //padding:10*moderateScale(1),
  },
  moreCardText:{
    paddingTop:10*moderateScale(1),
    paddingBottom:10*moderateScale(1),
    //padding: 10*moderateScale(1),
    fontSize: 20*moderateScale(1),
    lineHeight: 25*moderateScale(1),
    textAlign: "justify",  
  },
  introText:{
    padding: 20*moderateScale(1),
    fontSize: 20*moderateScale(1),
    lineHeight: 25*moderateScale(1),
    textAlign: "justify",  
  }
});

/*   Styles for all texts, input fields, and buttons, avatar in the app (ui folder)   */

export const textStyles = EStyleSheet.create({
  headingText: {
    color: BLUE_TEXT_COLOR,
    fontSize: `${1.875 * moderateScale(1)}rem`,
    lineHeight: `${2.25 * moderateScale(1)}rem`,
    fontWeight: "700",
  },
  field: {
    padding: `${0.5 * moderateScale(1)}rem`,
    marginTop: `${0.5 * moderateScale(1)}rem`,
    backgroundColor: "#F3F4F6",
    fontSize: `${1.625 * moderateScale(1)}rem`,
    lineHeight: `${2 * moderateScale(1)}rem`,
    width: "100%",
    borderRadius: `${0.75 * moderateScale(1)}rem`,
    marginBottom: `${0.75 * moderateScale(1)}rem`,
    borderBottomColor: "#000000",
    borderBottomWidth: 1,
  },
  fieldTitle: {
    paddingTop: `${0.25 * moderateScale(1)}rem`,
    color: BLUE_TEXT_COLOR,
    fontSize: `${1.25 * moderateScale(1)}rem`,
    lineHeight: `${1.75 * moderateScale(1)}rem`,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  smallText: {
    paddingTop: `${0.25 * moderateScale(1)}rem`,
    color: BLUE_TEXT_COLOR,
    fontSize: `${1.25 * moderateScale(1)}rem`,
    lineHeight: `${1.75 * moderateScale(1)}rem`,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  largeText: {
    color: BLUE_TEXT_COLOR,
    fontSize: `${1.5 * moderateScale(1)}rem`,
    lineHeight: `${2 * moderateScale(1)}rem`,
    fontWeight: "700",
  },
  buttonStyle: {
    paddingTop: `${0.5 * moderateScale(1)}rem`,
    paddingBottom: `${0.5 * moderateScale(1)}rem`,
    marginTop: `${1 * moderateScale(1)}rem`,
    marginBottom: `${1 * moderateScale(1)}rem`,
    backgroundColor: YELLOW_BUTTON_COLOR,
    color: BLUE_TEXT_COLOR,
    width: "100%",
    borderRadius: "0.75rem",
  },
  buttonText: {
    color: BLUE_TEXT_COLOR,
    fontSize: `${1.5 * moderateScale(1)}rem`,
    lineHeight: `${2 * moderateScale(1)}rem`,
    textAlign: "center",
  },
  avatarContainer: {
    marginRight: `${0.75 * moderateScale(1)}rem`,
    backgroundColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
    width: `${2.75 * moderateScale(1)}rem`,
    height: `${2.75 * moderateScale(1)}rem`,
    borderRadius: "100rem",
  },
  avatarText: {
    color: "#ffffff",
    fontSize: `${1.5 * moderateScale(1)}rem`,
    lineHeight: `${2 * moderateScale(1)}rem`,
    fontWeight: "500",
  },
});
