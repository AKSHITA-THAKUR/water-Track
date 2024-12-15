import { StyleSheet } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { Codes } from "./colors";
const customeStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(7),
    backgroundColor: Codes.primaryBackground,
    marginTop: hp(10),
  },
  heading: {
    fontSize: hp(4),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: hp(3),
    color: Codes.primaryText,
  },
  subHeading: {
    fontSize: hp(2.3),
    marginBottom: hp(2),
    color: Codes.secondaryText,
    textAlign: "center",
  },
  Text: {
    fontSize: hp(2),
    marginBottom: hp(1.6),
    textAlign: "center",
  },
});
export default customeStyles;
