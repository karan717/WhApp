import { Dimensions } from "react-native";

const {width, height} = Dimensions.get('window')

const guidelineBaseWidth = 375;//375
const guidelineBaseHeight = 812;//812

const horizontalScale = (size:number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size:number) => (height / guidelineBaseHeight) * size;
const moderateScale = (size:number , factor = 0.2) => size + (horizontalScale(size) - size)*factor;

export {horizontalScale, verticalScale, moderateScale}
