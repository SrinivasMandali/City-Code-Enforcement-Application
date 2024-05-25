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
    height: moderateScale(60),
    marginTop: Platform.OS === "ios" ? verticalScale(20) : verticalScale(40),
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
  oneTextStyle: {
    fontSize: textScale(18),
    fontFamily: "C-Bold",
    color: colors.black,
    paddingTop: verticalScale(10),
  },
  detailsLines: {
    width: moderateScale(350),
    padding: moderateScale(8),
    borderRadius: moderateScale(10),
    backgroundColor: colors.secondary,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: verticalScale(10),
  },
  details: {
    marginHorizontal: scale(24),
    marginTop: verticalScale(10),
  },
  xAxisLabelTextStyle: {
    fontSize: textScale(9),
    color: colors.black,
    fontFamily: "C-Regular",
    paddingTop: verticalScale(5),
  },
  yAxisTextStyle: {
    fontSize: textScale(14),
    color: colors.black,
    fontFamily: "C-Regular",
    paddingRight: scale(5),
  },
  barStyle: {
    width: moderateScale(10),
  },
  barStyle2: {
    marginHorizontal: scale(24),
    marginTop: verticalScale(20),
  },
  activityIndicatorCont: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
    marginBottom: 10,
  },
  legendColor: {
    width: 10,
    height: 10,
    marginRight: 5,
    borderRadius: 5,
  },
  legendText: {
    fontSize: textScale(14),
    fontFamily: "C-Regular",
    color: "#333", // Adjust color as needed
    paddingLeft: scale(5),
  },
});

export default styles;
