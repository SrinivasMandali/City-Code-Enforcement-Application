import React from "react";
import * as Screens from "../screens";
import navigationStrings from "../constants/navigationStrings";
import TabNavigation from "./TabNavigation";
import CustomDrawer from "./CustomDrawer";

export default function (Stack) {
  return (
    <>
      <Stack.Screen
        name={navigationStrings.CUSTOM_DRAWER}
        component={CustomDrawer}
      />
      <Stack.Screen
        name={navigationStrings.ACTIVE_CASE_DETAILS}
        component={Screens.ActiveCaseDetails}
      />
      <Stack.Screen
        name={navigationStrings.ACTIVE_CASE_ON_MAP}
        component={Screens.ActiveCaseOnMap}
      />
      <Stack.Screen
        name={navigationStrings.GET_STARTED}
        component={Screens.GetStarted}
      />
      <Stack.Screen
        name={navigationStrings.DESIGN_HELP}
        component={Screens.DesignHelp}
      />
      <Stack.Screen name={navigationStrings.FAQ} component={Screens.FAQ} />
      <Stack.Screen
        name={navigationStrings.CONTACT_US}
        component={Screens.ContactUs}
      />
      <Stack.Screen
        name={navigationStrings.SETTINGS}
        component={Screens.Settings}
      />
      <Stack.Screen
        name={navigationStrings.ACKNOWLEDEMENTS}
        component={Screens.Acknowledements}
      />
      <Stack.Screen
        name={navigationStrings.PRIVACY_POLICY}
        component={Screens.PrivacyPolicy}
      />
      <Stack.Screen name={navigationStrings.LOGIN} component={Screens.Login} />
      <Stack.Screen
        name={navigationStrings.EDIT_ACTIVE_CASE}
        component={Screens.EditActiveCase}
      />
    </>
  );
}
