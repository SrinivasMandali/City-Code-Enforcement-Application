import { StyleSheet, View } from "react-native";
import Routes from "./src/navigation/Routes";
import colors from "./src/constants/colors";
import { useFonts } from "expo-font";
import FlashMessage from "react-native-flash-message";
import { textScale } from "./src/constants/resposiveSizes";
import { StatusBar } from "expo-status-bar";

export default function App() {
  const [fontsLoaded] = useFonts({
    "C-Bold": require("./src/assets/fonts/Comfortaa-Bold.ttf"),
    "C-Light": require("./src/assets/fonts/Comfortaa-Light.ttf"),
    "C-Medium": require("./src/assets/fonts/Comfortaa-Medium.ttf"),
    "C-Regular": require("./src/assets/fonts/Comfortaa-Regular.ttf"),
    "C-SemiBold": require("./src/assets/fonts/Comfortaa-SemiBold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor={colors.primary} />
      <Routes />
      <FlashMessage
        position={"top"}
        titleStyle={{
          fontFamily: "C-Medium",
          fontSize: textScale(14),
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
});
