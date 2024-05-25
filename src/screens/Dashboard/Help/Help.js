import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import styles from "./styles";
import colors from "../../../constants/colors";
import { MaterialIcons } from "@expo/vector-icons";
import navigationStrings from "../../../constants/navigationStrings";

const Help = ({ navigation }) => {
  // Rendrers
  function renderHeader() {
    return (
      <View style={styles.headerStyle}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons
            name="keyboard-backspace"
            size={30}
            color={colors.black}
          />
        </TouchableOpacity>
        <View style={styles.cityTextStyle}>
          <Text style={styles.city}>How can we help?</Text>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {renderHeader()}
      <TouchableOpacity
        onPress={() => navigation.navigate(navigationStrings.GET_STARTED)}
        activeOpacity={0.8}
        style={styles.buttonStyle}
      >
        <Text style={styles.textStyle}> Get Started</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate(navigationStrings.DESIGN_HELP)}
        activeOpacity={0.8}
        style={styles.buttonStyle}
      >
        <Text style={styles.textStyle}>Design Help</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate(navigationStrings.FAQ)}
        activeOpacity={0.8}
        style={styles.buttonStyle}
      >
        <Text style={styles.textStyle}>FAQ</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate(navigationStrings.SETTINGS)}
        activeOpacity={0.8}
        style={styles.buttonStyle}
      >
        <Text style={styles.textStyle}>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate(navigationStrings.CONTACT_US)}
        activeOpacity={0.8}
        style={styles.buttonStyle}
      >
        <Text style={styles.textStyle}>Contact Us</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Help;
