import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Linking,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
} from "expo-location";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import styles from "./styles";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  height,
  moderateScale,
  scale,
  verticalScale,
  width,
} from "../../../constants/resposiveSizes";
import colors from "../../../constants/colors";
import { MaterialIcons } from "@expo/vector-icons";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_MAPS_API } from "../../../config/Google";

const ActiveCaseOnMap = ({ route, navigation }) => {
  const { item } = route.params;
  const [region, setRegion] = useState(null);
  const [routeDuration, setRouteDuration] = useState(null);
  const [showDirections, setShowDirections] = useState(false);
  const mapViewRef = useRef();
  const bottomSheetRef = useRef(null);

  useEffect(() => {
    getLocationAsync();
  }, []);

  // Handlers
  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);

  const handleStartNavigation = () => {
    const destination = `${item.lat},${item.lng}`;
    Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&destination=${destination}`
    );
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
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  function renderMaps() {
    return (
      <>
        <MapView
          ref={mapViewRef}
          region={region}
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
        >
          {region && showDirections && (
            <MapViewDirections
              origin={{
                latitude: region.latitude,
                longitude: region.longitude,
              }}
              destination={{
                latitude: parseFloat(item.lat),
                longitude: parseFloat(item.lng),
              }}
              apikey={GOOGLE_MAPS_API}
              strokeWidth={5}
              strokeColor={colors.navy}
              optimizeWaypoints={true}
              onReady={(result) => {
                setRouteDuration(result.duration);
                if (mapViewRef.current) {
                  mapViewRef.current.fitToCoordinates(result.coordinates, {
                    edgePadding: {
                      right: width / 20,
                      bottom: height / 20,
                      left: width / 20,
                      top: height / 20,
                    },
                    animated: true,
                  });
                }
              }}
              onError={(errorMessage) => {
                showError(errorMessage);
              }}
            />
          )}
          <Marker coordinate={{ latitude: item.lat, longitude: item.lng }} />
        </MapView>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            position: "absolute",
            top: verticalScale(60),
            left: scale(20),
          }}
          activeOpacity={0.8}
        >
          <MaterialIcons
            name="keyboard-backspace"
            size={30}
            color={colors.black}
          />
        </TouchableOpacity>
      </>
    );
  }

  function renderBottomSheet() {
    return (
      <BottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        snapPoints={["25%", "50%", "75%"]}
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text
            style={[
              styles.oneTextStyle,
              {
                paddingLeft: scale(20),
                paddingRight: scale(70),
                paddingTop: verticalScale(20),
              },
            ]}
          >
            {item.address}
          </Text>

          <View
            style={{
              flexDirection: "row",
            }}
          >
            <TouchableOpacity
              onPress={() => setShowDirections(true)}
              activeOpacity={0.8}
              style={[
                styles.submitButton,
                {
                  height: moderateScale(38),
                  width: moderateScale(150),
                  backgroundColor: colors.green,
                  marginHorizontal: scale(20),
                },
              ]}
            >
              <Text
                style={[
                  styles.submitText,
                  {
                    color: colors.black,
                  },
                ]}
              >
                Directions
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleStartNavigation}
              activeOpacity={0.8}
              style={[
                styles.submitButton,
                {
                  height: moderateScale(38),
                  width: moderateScale(150),
                  backgroundColor: colors.green,
                  marginHorizontal: 0,
                },
              ]}
            >
              <Text
                style={[
                  styles.submitText,
                  {
                    color: colors.black,
                  },
                ]}
              >
                Start
              </Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheet>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {renderMaps()}
        {renderBottomSheet()}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default ActiveCaseOnMap;
