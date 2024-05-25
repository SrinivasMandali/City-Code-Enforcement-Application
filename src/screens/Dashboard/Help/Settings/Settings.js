import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import navigationStrings from "../../../../constants/navigationStrings";
import colors from "../../../../constants/colors";
import styles from "../styles";

const Settings = ({ navigation }) => {
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
          <Text style={styles.city}>Settings</Text>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {renderHeader()}
      <TouchableOpacity
        onPress={() => navigation.navigate(navigationStrings.PRIVACY_POLICY)}
        activeOpacity={0.8}
        style={styles.buttonStyle}
      >
        <Text style={styles.textStyle}>Privacy Policy</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate(navigationStrings.ACKNOWLEDEMENTS)}
        activeOpacity={0.8}
        style={styles.buttonStyle}
      >
        <Text style={styles.textStyle}>Acknowledgements</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate(navigationStrings.LOGIN)}
        activeOpacity={0.8}
        style={styles.buttonStyle}
      >
        <Text style={styles.textStyle}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Settings;
