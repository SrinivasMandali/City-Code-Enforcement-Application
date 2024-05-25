import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import navigationStrings from "../constants/navigationStrings";
import * as Screens from "../screens";
import { textScale } from "../constants/resposiveSizes";
import colors from "../constants/colors";
import { Feather } from "@expo/vector-icons";
import TabNavigation from "./TabNavigation";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Drawer = createDrawerNavigator();

const CustomDrawer = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: colors.primary,
          width: "70%",
        },
        drawerActiveTintColor: colors.navy,
        drawerInactiveTintColor: colors.black,
        drawerLabelStyle: {
          fontSize: textScale(16),
          fontFamily: "C-Regular",
          color: colors.black,
        },
      }}
    >
      <Drawer.Screen
        name={navigationStrings.TAB}
        component={TabNavigation}
        options={{
          drawerLabel: "Home",
          drawerIcon: ({ focused, size }) => {
            return <Feather name="home" size={30} color="black" />;
          },
        }}
      />
      <Drawer.Screen
        name={navigationStrings.ACTIVE_CASE}
        component={Screens.ActiveCase}
        options={{
          drawerLabel: "Active Cases",
          drawerIcon: ({ focused, size }) => {
            return <MaterialIcons name="cases" size={30} color="black" />;
          },
        }}
      />
      <Drawer.Screen
        name={navigationStrings.OPEN_NEW_CASE}
        component={Screens.OpenNewCase}
        options={{
          drawerLabel: "Open New Case",
          drawerIcon: ({ focused, size }) => {
            return <FontAwesome5 name="folder-open" size={30} color="black" />;
          },
        }}
      />

      <Drawer.Screen
        name={navigationStrings.PRIVACY_POLICY}
        component={Screens.PrivacyPolicy}
        options={{
          drawerLabel: "Policy",
          drawerIcon: ({ focused, size }) => {
            return <MaterialIcons name="policy" size={30} color="black" />;
          },
        }}
      />
    </Drawer.Navigator>
  );
};

export default CustomDrawer;
