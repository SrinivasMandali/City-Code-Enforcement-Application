import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import styles from "./styles";
import colors from "../../../constants/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { PieChart } from "react-native-gifted-charts";
import { verticalScale } from "../../../constants/resposiveSizes";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { useFocusEffect } from "@react-navigation/native";
import constants from "../../../constants/constants";

const Reports = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [activeCases, setActiveCase] = useState([]);

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

  // Handlers
  const getData = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "cases"));
      const casesData = [];
      querySnapshot.forEach((doc) => {
        casesData.push({ id: doc.id, ...doc.data() });
      });
      setActiveCase(casesData);
      setLoading(false);
    } catch (error) {
      console.error("Error getting documents: ", error);
      setLoading(false);
    }
  };

  const getFixedColor = (index) => {
    const fixedColors = [
      "#177AD5",
      "#79D2DE",
      "#ED6665",
      "#FFC107",
      "#4CAF50",
      "#FF5722",
    ];
    return fixedColors[index % fixedColors.length];
  };

  // Renderers
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
          <Text style={styles.city}>History Details</Text>
        </View>
      </View>
    );
  }

  function renderReportsDetails() {
    const resolvedCases = activeCases.filter(
      (item) => item.status === "Resolve"
    );
    const pendingCases = activeCases.filter(
      (item) => item.status === "Pending"
    );
    return (
      <>
        <View style={styles.details}>
          <Text style={styles.oneTextStyle}>Total Cases</Text>
          <View style={styles.detailsLines}>
            <Text style={styles.oneTextStyle}>{activeCases.length}</Text>
          </View>
        </View>
        <View style={styles.details}>
          <Text style={styles.oneTextStyle}>Resolved Cases</Text>
          <View style={styles.detailsLines}>
            <Text style={styles.oneTextStyle}>
              {resolvedCases.length > 0 ? (
                <Text style={styles.oneTextStyle}>{resolvedCases.length}</Text>
              ) : (
                <Text style={styles.oneTextStyle}>0</Text>
              )}
            </Text>
          </View>
        </View>
        <View style={styles.details}>
          <Text style={styles.oneTextStyle}>Pending Cases</Text>
          <View style={styles.detailsLines}>
            {pendingCases.length > 0 ? (
              <Text style={styles.oneTextStyle}>{pendingCases.length}</Text>
            ) : (
              <Text style={styles.oneTextStyle}>0</Text>
            )}
          </View>
        </View>
      </>
    );
  }

  function renderViolationAnalysis() {
    const violationCounts = activeCases.reduce((acc, curr) => {
      if (curr.violation in acc) {
        acc[curr.violation]++;
      } else {
        acc[curr.violation] = 1;
      }
      return acc;
    }, {});

    const totalViolations = Object.values(violationCounts).reduce(
      (acc, curr) => acc + curr,
      0
    );
    const pieData = Object.keys(violationCounts).map((violation, index) => {
      const percentage = (
        (violationCounts[violation] / totalViolations) *
        100
      ).toFixed(2);
      return {
        value: violationCounts[violation],
        color: getFixedColor(index),
        text: `${percentage}%`,
      };
    });

    return (
      <View style={styles.barStyle2}>
        <Text
          style={[
            styles.oneTextStyle,
            {
              marginBottom: verticalScale(20),
            },
          ]}
        >
          Violation Analysis
        </Text>
        {/* Legend */}
        <View style={styles.legendContainer}>
          {constants.violations.map((violation, index) => (
            <View key={violation.id} style={styles.legendItem}>
              <View
                style={[
                  styles.legendColor,
                  { backgroundColor: violation.dotColor },
                ]}
              />
              <Text style={styles.legendText}>{violation.violation}</Text>
            </View>
          ))}
        </View>
        {/* Pie Chart */}
        <PieChart
          data={pieData}
          isThreeD
          showText
          textColor="black"
          radius={150}
          textSize={20}
          focusOnPress
          showValuesAsLabels
          showTextBackground
          textBackgroundRadius={60}
        />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.activityIndicatorCont}>
        <ActivityIndicator size={"small"} color={colors.navy} />
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: verticalScale(50),
        }}
      >
        {renderHeader()}
        {renderReportsDetails()}
        {renderViolationAnalysis()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Reports;
