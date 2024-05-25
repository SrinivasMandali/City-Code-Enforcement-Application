import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import React, { useRef, useEffect, useState, useCallback } from "react";
import styles from "./styles";
import { Feather } from "@expo/vector-icons";
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
} from "expo-location";
import { GOOGLE_MAPS_API } from "../../../config/Google";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../config/firebase";
import colors from "../../../constants/colors";
import navigationStrings from "../../../constants/navigationStrings";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { textScale, verticalScale } from "../../../constants/resposiveSizes";
import { useFocusEffect } from "@react-navigation/native";

const Inspection = ({ navigation }) => {
  const mapViewRef = useRef();
  const [region, setRegion] = useState(null);
  const [latOfDetails, setLatOfDetails] = useState(0);
  const [lngOfDetails, setLngOfDetails] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeCase, setActiveCase] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [casesWithinRadius, setCasesWithinRadius] = useState([]);
  const [circleRadius, setCircleRadius] = useState(0);

  const bottomSheetRef = useRef(null);
  useEffect(() => {
    getLocationAsync();
    getData();
  }, []);
  // Handlers

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
      setActiveCase(casesData);
      setLoading(false);
    } catch (error) {
      console.error("Error getting documents: ", error);
      setLoading(false);
    }
  };

  const getLocationAsync = async () => {
    let { status } = await requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }

    let location = await getCurrentPositionAsync({});
    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.08,
      longitudeDelta: 0.08,
    });
  };

  const handleSheetChanges = useCallback((index) => {
    if (index === -1) {
      setLatOfDetails(0);
      setLngOfDetails(0);
    }
  }, []);

  // Renderers

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      0.5 -
      Math.cos(dLat) / 2 +
      (Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        (1 - Math.cos(dLon))) /
        2;

    return R * 2 * Math.asin(Math.sqrt(a));
  }

  function renderSearchBar() {
    const handleTextInputChange = async (text) => {
      if (text === "") {
        try {
          let location = await getCurrentPositionAsync({});

          if (mapViewRef.current) {
            mapViewRef.current.animateToRegion({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
          }
          setModalVisible(false);
        } catch (error) {
          console.error(error);
        }
      }
    };

    return (
      <View View style={styles.searchBarCont}>
        <GooglePlacesAutocomplete
          textInputProps={{
            onChangeText: handleTextInputChange,
          }}
          styles={{
            textInputContainer: styles.textInputContainer,
            textInput: styles.textInput,
          }}
          onPress={(data, details = null) => {
            if (details) {
              const { lat, lng } = details.geometry.location;
              setLatOfDetails(lat);
              setLngOfDetails(lng);
              mapViewRef.current.animateToRegion({
                latitude: lat,
                longitude: lng,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              });

              const casesWithinRadius = activeCase.filter((item) => {
                const distance = calculateDistance(
                  lat,
                  lng,
                  item.lat,
                  item.lng
                );
                return distance < 5;
              });
              if (casesWithinRadius.length > 0) {
                setCasesWithinRadius(casesWithinRadius);
                setCircleRadius(5000);
                setModalVisible(true);
              } else {
                setCasesWithinRadius([]);
                setCircleRadius(null);
                setModalVisible(false);
              }
            }
          }}
          fetchDetails={true}
          placeholder={"Find Location..."}
          query={{
            key: GOOGLE_MAPS_API,
            language: "en",
          }}
        />
      </View>
    );
  }

  function renderHeader() {
    return (
      <View style={styles.headerStyle}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.openDrawer()}
        >
          <Feather name="menu" size={30} color="black" />
        </TouchableOpacity>
        <View style={styles.cityTextStyle}>
          <Text style={styles.city}>CITY CODE ENFORCEMENT</Text>
        </View>
      </View>
    );
  }

  function renderMaps() {
    return (
      <>
        <MapView
          ref={mapViewRef}
          region={region}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          showsMyLocationButton={false}
          style={{
            flex: 1,
          }}
        >
          {latOfDetails !== 0 && lngOfDetails !== 0 && (
            <Marker
              coordinate={{
                latitude: latOfDetails,
                longitude: lngOfDetails,
              }}
            />
          )}
          <Circle
            center={{
              latitude: latOfDetails,
              longitude: lngOfDetails,
            }}
            radius={circleRadius}
            strokeWidth={1}
            strokeColor="rgba(255,0,0,0.5)"
            fillColor="rgba(255,0,0,0.2)"
          />
          {activeCase !== null && activeCase !== undefined
            ? activeCase.map((item, index) => {
                return (
                  <Marker
                    key={index}
                    coordinate={{
                      latitude: item.lat,
                      longitude: item.lng,
                    }}
                    onPress={() =>
                      navigation.navigate(
                        navigationStrings.ACTIVE_CASE_DETAILS,
                        {
                          item,
                          key: "fromInspection",
                        }
                      )
                    }
                  />
                );
              })
            : null}
          {casesWithinRadius.map((item, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: item.lat,
                longitude: item.lng,
              }}
              onPress={() =>
                navigation.navigate(navigationStrings.ACTIVE_CASE_DETAILS, {
                  item,
                  key: "fromInspection",
                })
              }
            />
          ))}
        </MapView>
        {renderSearchBar()}
      </>
    );
  }

  function renderModal() {
    return (
      <BottomSheet
        enablePanDownToClose={true}
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        snapPoints={["25%", "50%", "75%"]}
        onClose={() => setModalVisible(false)}
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text
            style={{
              fontSize: textScale(16),
              color: colors.black,
              fontWeight: "bold",
              fontFamily: "C-Bold",
              textAlign: "center",
              paddingVertical: verticalScale(10),
            }}
          >
            You have {casesWithinRadius.length} cases around this location
          </Text>
          {casesWithinRadius.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  navigation.navigate(navigationStrings.ACTIVE_CASE_DETAILS, {
                    item,
                    key: "fromActiveCase",
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
                <View style={{ flex: 1 }}>
                  <Text style={styles.textStyle}>{item.status}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </BottomSheetView>
      </BottomSheet>
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
      {renderMaps()}
      {modalVisible && renderModal()}
    </SafeAreaView>
  );
};

export default Inspection;
