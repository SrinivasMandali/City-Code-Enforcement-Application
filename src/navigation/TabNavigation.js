import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import navigationStrings from "../constants/navigationStrings";
import * as Screens from "../screens";
import {
  moderateScale,
  textScale,
  verticalScale,
} from "../constants/resposiveSizes";
import colors from "../constants/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Platform } from "react-native";

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelPosition: "beside-icon",
        tabBarStyle: {
          height: Platform.OS == "ios" ? verticalScale(66) : verticalScale(55),
          backgroundColor: colors.primary,
        },

        tabBarActiveTintColor: colors.navy,
        tabBarInactiveTintColor: colors.black,
      }}
    >
      <Tab.Screen
        name={navigationStrings.INSPECTION}
        component={Screens.Inspection}
        options={{
          tabBarLabel: "Home",
          tabBarLabelStyle: {
            fontSize: textScale(12),
            fontFamily: "C-Bold",
            fontWeight: "700",
          },
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="text-box-search-outline"
              size={24}
              color={focused ? colors.navy : colors.black}
            />
          ),
        }}
      />
      <Tab.Screen
        name={navigationStrings.REPORTS}
        component={Screens.Reports}
        options={{
          tabBarLabel: "Report",
          tabBarLabelStyle: {
            fontSize: textScale(12),
            fontFamily: "C-Bold",
            fontWeight: "700",
          },
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="file-document-multiple-outline"
              size={24}
              color={focused ? colors.navy : colors.black}
            />
          ),
        }}
      />

      <Tab.Screen
        name={navigationStrings.NOTIFICATIONS}
        component={Screens.Notifications}
        options={{
          tabBarLabel: "Notify",
          tabBarLabelStyle: {
            fontSize: textScale(12),
            fontFamily: "C-Bold",
            fontWeight: "700",
          },
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="notifications-none"
              size={24}
              color={focused ? colors.navy : colors.black}
            />
          ),
        }}
      />
      <Tab.Screen
        name={navigationStrings.HELP}
        component={Screens.Help}
        options={{
          tabBarLabel: "Help",
          tabBarLabelStyle: {
            fontSize: textScale(12),
            fontFamily: "C-Bold",
            fontWeight: "700",
          },
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="help-rhombus-outline"
              size={24}
              color={focused ? colors.navy : colors.black}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
