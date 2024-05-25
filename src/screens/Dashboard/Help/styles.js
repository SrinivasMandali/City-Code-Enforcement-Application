import { Platform, StyleSheet } from "react-native";
import colors from "../../../constants/colors";
import {
  moderateScale,
  scale,
  textScale,
  verticalScale,
} from "../../../constants/resposiveSizes";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  headerStyle: {
    marginTop: Platform.OS === "ios" ? verticalScale(20) : verticalScale(40),
    height: moderateScale(60),
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: scale(24),
    paddingBottom: verticalScale(10),
  },
  cityTextStyle: {
    flex: 1,
  },
  city: {
    textAlign: "center",
    fontSize: textScale(20),
    fontWeight: "bold",
    color: colors.black,
  },
  buttonStyle: {
    width: "100%",
    height: moderateScale(58),
    backgroundColor: colors.lightPink,
    paddingHorizontal: scale(16),
    alignItems: "flex-start",
    justifyContent: "center",
    marginTop: verticalScale(5),
  },
  textStyle: {
    fontSize: textScale(18),
    color: colors.black,
    fontFamily: "C-Regular",
  },
});

export default styles;
