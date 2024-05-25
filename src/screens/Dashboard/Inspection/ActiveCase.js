import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import styles from "./styles";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../../../constants/colors";
import navigationStrings from "../../../constants/navigationStrings";
import { AntDesign } from "@expo/vector-icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../config/firebase";
import {
  moderateScale,
  verticalScale,
} from "../../../constants/resposiveSizes";
import Modal from "react-native-modal";
import { useFocusEffect } from "@react-navigation/native";

const ActiveCase = ({ navigation }) => {
  const [searchValue, setSearchValue] = useState("");
  const [activeCases, setActiveCase] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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
        const caseData = { id: doc.id, ...doc.data() };
        if (caseData.status === "Pending") {
          casesData.push(caseData);
        }
      });
      setActiveCase(casesData);
      setLoading(false);
    } catch (error) {
      console.error("Error getting documents: ", error);
      setLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    getData();
    setRefreshing(false);
  };

  const handleFilter = (filterOption) => {
    let filteredData = [...activeCases];
    const currentDate = new Date();

    switch (filterOption) {
      case "today":
        filteredData = activeCases.filter((item) => {
          const caseDateParts = item.date.split("/");
          const caseDate = new Date(
            parseInt(caseDateParts[2]),
            parseInt(caseDateParts[0]) - 1,
            parseInt(caseDateParts[1])
          );
          return (
            caseDate.getDate() === currentDate.getDate() &&
            caseDate.getMonth() === currentDate.getMonth() &&
            caseDate.getFullYear() === currentDate.getFullYear()
          );
        });
        break;
      case "week":
        const weekStartDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() - currentDate.getDay()
        );
        filteredData = activeCases.filter((item) => {
          const caseDateParts = item.date.split("/");
          const caseDate = new Date(
            parseInt(caseDateParts[2]),
            parseInt(caseDateParts[0]) - 1,
            parseInt(caseDateParts[1])
          );
          return caseDate >= weekStartDate;
        });
        break;
      case "month":
        const monthStartDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        );
        filteredData = activeCases.filter((item) => {
          const caseDateParts = item.date.split("/");
          const caseDate = new Date(
            parseInt(caseDateParts[2]),
            parseInt(caseDateParts[0]) - 1,
            parseInt(caseDateParts[1])
          );
          return caseDate >= monthStartDate;
        });
        break;
      default:
        filteredData = activeCases;
    }
    setActiveCase(filteredData);
    setFilterModal(false);
  };

  const filteredData = activeCases.filter((item) =>
    item.caseName.toLowerCase().includes(searchValue.toLowerCase())
  );

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
          <Text style={styles.city}>Active Cases</Text>
        </View>
      </View>
    );
  }

  function renderCaseItem({ item }) {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(navigationStrings.ACTIVE_CASE_DETAILS, {
            item,
            key: "fromActiveCase2",
          })
        }
        activeOpacity={0.8}
        style={styles.caseItem}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.textStyle}>{item.caseName}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.textStyle}>{item.date}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  function renderSearchBar() {
    return (
      <View style={styles.searchbarStyle}>
        <View
          style={{
            flexDirection: "row",
            borderRadius: moderateScale(18),
            backgroundColor: colors.white,
            marginVertical: moderateScale(10),
            height: verticalScale(42),
          }}
        >
          <View style={styles.searchIcon}>
            <AntDesign name="search1" size={24} color="black" />
          </View>
          <TextInput
            style={styles.inputStyle}
            placeholder="Search"
            value={searchValue}
            onChangeText={(text) => setSearchValue(text)}
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setFilterModal(true)}
          style={styles.searchIcon}
        >
          <AntDesign name="filter" size={30} color="black" />
        </TouchableOpacity>
      </View>
    );
  }

  function renderBottomModal() {
    return (
      <Modal
        isVisible={filterModal}
        swipeDirection="down"
        style={styles.bottomModal}
        onBackdropPress={() => setFilterModal(false)}
      >
        <View style={styles.modalContent}>
          <TouchableOpacity
            onPress={() => handleFilter("today")}
            style={styles.filterButton}
          >
            <Text style={styles.filterText}>Today</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleFilter("week")}
            style={styles.filterButton}
          >
            <Text style={styles.filterText}>This Week</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleFilter("month")}
            style={styles.filterButton}
          >
            <Text style={styles.filterText}>This Month</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
      {renderHeader()}
      {renderSearchBar()}
      <View
        style={[
          styles.caseItem,
          {
            backgroundColor: colors.primary,
          },
        ]}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.heading}>Cases</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.heading}>Date</Text>
        </View>
      </View>

      {filteredData && filteredData.length > 0 ? (
        <FlatList
          data={filteredData}
          renderItem={renderCaseItem}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text
            style={[
              styles.heading,
              {
                paddingTop: verticalScale(30),
              },
            ]}
          >
            No Active Cases
          </Text>
        </View>
      )}
      {filterModal && renderBottomModal()}
    </SafeAreaView>
  );
};

export default ActiveCase;
