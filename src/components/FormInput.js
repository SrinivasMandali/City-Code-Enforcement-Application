import { View, Text, StyleSheet, TextInput } from "react-native";
import React from "react";
import {
  moderateScale,
  scale,
  textScale,
  verticalScale,
} from "../constants/resposiveSizes";
import colors from "../constants/colors";

const FormInput = ({
  label,
  placeholder,
  onChangeText,
  containerStyle,
  multiline,
  customStyling,
  value,
  editable,
  onSubmitEditing,
  customLabelStyle,
}) => {
  return (
    <View style={[styles.conatiner, containerStyle]}>
      <Text style={[styles.labelStyle, customLabelStyle]}>{label}</Text>
      <TextInput
        onSubmitEditing={onSubmitEditing}
        editable={editable}
        value={value}
        placeholder={placeholder}
        placeholderTextColor="#807f7f"
        style={[styles.inputStyle, customStyling]}
        onChangeText={onChangeText}
        multiline={multiline}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  conatiner: {
    height: moderateScale(75),
    marginHorizontal: scale(24),
    paddingVertical: verticalScale(10),
  },
  labelStyle: {
    fontSize: textScale(14),
    fontFamily: "C-Bold",
    color: colors.black,
    paddingLeft: scale(5),
    fontWeight: "700",
  },

  inputStyle: {
    height: moderateScale(41),
    backgroundColor: colors.white,
    marginTop: verticalScale(5),
    borderRadius: moderateScale(18),
    paddingHorizontal: scale(16),
    fontFamily: "C-Regular",
    fontSize: textScale(14),
    color: colors.black,
  },
});
export default FormInput;
