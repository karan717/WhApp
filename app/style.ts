import { StyleSheet } from "react-native"
import EStyleSheet from "react-native-extended-stylesheet"
import { verticalScale, horizontalScale, moderateScale } from "./Metrics"

const guidelineBaseWidth = 375;//375
const guidelineBaseHeight = 812;//812

//Style for main Layout of the app (backgroundColor white, otherwise it is default grey)
export const layoutStyle = EStyleSheet.create({
    container:{
        paddingTop: verticalScale(1)*50,
        backgroundColor: "#ffffff",
        width: "100%",
        height: "100%",
    }
})


/*   Styles for Auth Page   */
//Choose the shorter side of the screen
let logoSize = verticalScale(1)>horizontalScale(1)?horizontalScale(1):verticalScale(1);
export const authStyles = EStyleSheet.create({
    layoutContainer:{
        backgroundColor: "#ffffff",
        width: "100%",
        height: "100%",
    },
    keyboardContainer:{
        flex: 1,
        paddingTop: 60*logoSize,
        marginBottom: 60*logoSize,
    },
    scrollViewContainer:{
        flexGrow: 1, 
        justifyContent: 'center' 
    },
    innerViewContainer:{
        justifyContent: "center",
        alignItems: "center",
        marginLeft: horizontalScale(1)>1.5 ? horizontalScale(1)*guidelineBaseWidth*0.15:horizontalScale(1)*guidelineBaseWidth*0.1,
        marginRight: horizontalScale(1)>1.5 ? horizontalScale(1)*guidelineBaseWidth*0.15:horizontalScale(1)*guidelineBaseWidth*0.1,
        //for larger screens it will have 15% margin from each side, while for smaller screens it will have 10%
    },
    logoStyle:{
        width: 300*logoSize, 
        height: 220*logoSize, 
        marginBottom: 40*logoSize,
    },
    pressableStyle:{
        marginLeft: 'auto',
    },
})


/*   Styles for Footer   */

export const footerStyles = EStyleSheet.create({
    footerContainer:{
        paddingLeft: 5*moderateScale(1),
        paddingRight: 5*moderateScale(1),
        paddingTop: 20*verticalScale(1),
        paddingBottom: 20*verticalScale(1),
        backgroundColor: "#F9FAFB",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        borderTopColor: '#E1E1E1',
        borderTopWidth: 1*verticalScale(1),
    },
    footerText:{
        //color: "#3B82F6", blue
        //color: "#6B7280", gray
        fontSize:`${0.875*moderateScale(1)}rem`,
        lineHeight: `${1.25*moderateScale(1)}rem`,

    }
})

/* Styles for Home page */

export const homeStyles = EStyleSheet.create({
    layoutContainer:{
        backgroundColor: "#ffffff",
        width: "100%",
        height: "100%",
        paddingTop: verticalScale(1)*50,
    },
    outerContainer:{
        flex: 1,
    },
    scrollViewContainer:{
        flexGrow: 1, 
        justifyContent: 'center' 
    },
    innerViewContainer:{
        justifyContent: "center",
        alignItems: "center",
        //marginLeft: horizontalScale(1)>1.5 ? horizontalScale(1)*guidelineBaseWidth*0.15:horizontalScale(1)*guidelineBaseWidth*0.1,
        //marginRight: horizontalScale(1)>1.5 ? horizontalScale(1)*guidelineBaseWidth*0.15:horizontalScale(1)*guidelineBaseWidth*0.1,
        //for larger screens it will have 15% margin from each side, while for smaller screens it will have 10%
    },
    buttonViewContainer: {
        width: `${100-20*horizontalScale(1)}%`
      },
    textBattery: {
        fontSize: 25*moderateScale(1),
        textAlign: 'center',
        margin: 10,
        color: "#1F2937",
      },
    separator: {
        marginVertical: 15*verticalScale(1),
        borderBottomColor: '#1F2937',
        borderBottomWidth: StyleSheet.hairlineWidth,
      },

})

/* Style for Profile page */

/*   Styles for Route page  */

export const routeStyles = EStyleSheet.create({

})

/*   Styles for all texts, input fields, and buttons, avatar in the app (ui folder)   */

export const textStyles = EStyleSheet.create({ 
    headingText:{
        color: "#1F2937",
        fontSize: `${1.875*moderateScale(1)}rem`,
        lineHeight: `${2.25*moderateScale(1)}rem`,
        fontWeight: "700",
    },
    field:{
        padding: `${0.5*moderateScale(1)}rem`,
        marginTop: `${0.5*moderateScale(1)}rem`,
        backgroundColor: "#F3F4F6",
        fontSize: `${1.625*moderateScale(1)}rem`,
        lineHeight: `${2*moderateScale(1)}rem`,
        width: "100%",
        borderRadius: `${0.75*moderateScale(1)}rem`,
        marginBottom: `${0.75*moderateScale(1)}rem`,
        borderBottomColor: '#000000',
        borderBottomWidth: 1,
    },
    fieldTitle:{
        paddingTop: `${0.25*moderateScale(1)}rem`,
        color: "#1F2937",
        fontSize: `${1.25*moderateScale(1)}rem`,
        lineHeight: `${1.75*moderateScale(1)}rem`,
        flexDirection: "row",
        alignItems: "flex-end",
    },
    smallText:{
        paddingTop: `${0.25*moderateScale(1)}rem`,
        color: "#1F2937",
        fontSize: `${1.25*moderateScale(1)}rem`,
        lineHeight: `${1.75*moderateScale(1)}rem`,
        flexDirection: "row",
        alignItems: "flex-end",

    },
    largeText:{
        color: "#1F2937",
        fontSize: `${1.5*moderateScale(1)}rem`,
        lineHeight: `${2*moderateScale(1)}rem`,
        fontWeight: "700",
    },
    buttonStyle:{
        paddingTop: `${0.5*moderateScale(1)}rem`,
        paddingBottom: `${0.5*moderateScale(1)}rem`,
        marginTop: `${1*moderateScale(1)}rem`,
        marginBottom: `${1*moderateScale(1)}rem`,
        backgroundColor: "#FCD34D",
        color: "#1F2937",
        width: "100%",
        borderRadius: "0.75rem",        
    },
    buttonText:{
        color: "#1F2937",
        fontSize: `${1.5*moderateScale(1)}rem`,
        lineHeight: `${2*moderateScale(1)}rem`,
        textAlign: "center",        
    },
    avatarContainer:{
        marginRight: `${0.75*moderateScale(1)}rem`,
        backgroundColor: "#D1D5DB",
        justifyContent: "center",
        alignItems: "center",
        width: `${2.75*moderateScale(1)}rem`,
        height: `${2.75*moderateScale(1)}rem`,
        borderRadius: "100rem",
    },
    avatarText:{
        color: "#ffffff",
        fontSize: `${1.5*moderateScale(1)}rem`,
        lineHeight: `${2*moderateScale(1)}rem`,
        fontWeight: "500",
        
    },
})