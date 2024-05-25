import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import styles from "./styles";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../../../constants/colors";
import { useFocusEffect } from "@react-navigation/native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../config/firebase";
import navigationStrings from "../../../constants/navigationStrings";

const Notifications = ({ navigation }) => {
  const [activeCases, setActiveCases] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getData();
      return () => {
        console.log("Screen is unfocused");
      };
    }, [])
  );
  const getData = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "cases"));
      const casesData = [];
      querySnapshot.forEach((doc) => {
        casesData.push({ id: doc.id, ...doc.data() });
      });
      setActiveCases(casesData.filter((item) => item.status === "Pending"));
      setLoading(false);
    } catch (error) {
      console.error("Error getting documents: ", error);
      setLoading(false);
    }
  };

  const calculateDaysSince = (dateString) => {
    const dateComponents = dateString.split("/");
    const pendingDate = new Date(
      `${dateComponents[2]}-${dateComponents[0]}-${dateComponents[1]}`
    );
    const currentDate = new Date();
    const differenceInTime = currentDate.getTime() - pendingDate.getTime();
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays;
  };

  const renderNotifications = () => {
    return activeCases.map((item) => {
      const daysSincePending = calculateDaysSince(item.date);
      if (daysSincePending > 0) {
        return (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate(navigationStrings.ACTIVE_CASE_DETAILS, {
                item,
                key: "fromNotification",
              })
            }
            key={item.id}
            style={styles.notificationItem}
          >
            <Text style={styles.notificationText}>
              {`You have ${item.caseName} pending for ${daysSincePending} days`}
            </Text>
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate(navigationStrings.ACTIVE_CASE_DETAILS, {
                item,
                key: "fromNotification",
              })
            }
            key={item.id}
            style={styles.notificationItem}
          >
            <Text style={styles.notificationText}>
              {`You have ${item.caseName} pending `}
            </Text>
          </TouchableOpacity>
        ); // Don't render if daysSincePending is 0
      }
    });
  };

  const renderHeader = () => {
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
          <Text style={styles.city}>Notifications</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.activityIndicatorCont}>
        <ActivityIndicator size={"small"} color={colors.navy} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <View style={styles.notificationContainer}>
        {activeCases.length > 0 ? (
          renderNotifications()
        ) : (
          <Text>No pending cases</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Notifications;
