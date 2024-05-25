import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import styles from "./styles";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../../../constants/colors";
import FormInput from "../../../components/FormInput";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  moderateScale,
  verticalScale,
} from "../../../constants/resposiveSizes";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
} from "expo-location";
import { AntDesign } from "@expo/vector-icons";
import constants from "../../../constants/constants";
import Modal from "react-native-modal";
import Geocoder from "react-native-geocoding";
import { GOOGLE_MAPS_API } from "../../../config/Google";
import * as ImagePicker from "expo-image-picker";
import { Entypo } from "@expo/vector-icons";
import { Video } from "expo-av";
import uploadImageAndVideo from "../../../utils/uploadDataToFirebase";
import { db } from "../../../config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { showSucess } from "../../../utils/helperFunctions";
import navigationStrings from "../../../constants/navigationStrings";

const EditActiveCase = ({ navigation, route }) => {
  const { item } = route.params;
  console.log(item);
  const [date, setDate] = useState(item.date || "");
  const [lat, setLat] = useState(item.lat || "");
  const [lng, setLng] = useState(item.lng || "");
  const [caseName, setCaseName] = useState(item.caseName || "");
  const [address, setAddress] = useState(item.address || "");
  const [city, setCity] = useState(item.city || "");
  const [country, setCountry] = useState(item.country || "");
  const [province, setProvince] = useState(item.province || "");
  const [zip, setZip] = useState(item.zip || "");
  const [description, setDescription] = useState(item.description || "");
  const [region, setRegion] = useState(null);
  const [showDropDown, setShowDropDown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [formCompleted, setFormCompleted] = useState(false);
  const [violation, setViolation] = useState(item.violation || "");
  const [images, setImages] = useState(item.images);
  const [videos, setVideos] = useState(item.videos);
  const [videosUrl, setVideosUrl] = useState([]);
  const [imagesUrl, setImagesUrl] = useState([]);
  const mapViewRef = useRef();

  useEffect(() => {
    Geocoder.init(GOOGLE_MAPS_API);
  }, []);

  useEffect(() => {
    getLocationAsync();
    handleCurrentDate();
  }, []);

  useEffect(() => {
    checkFormCompletion();
  }, [
    date,
    lat,
    lng,
    caseName,
    address,
    city,
    country,
    province,
    zip,
    description,
    images,
    videos,
  ]);

  // Handlers

  const updateData = async () => {
    try {
      setLoading(true);
      const caseRef = doc(db, "cases", item.id);
      const caseData = {
        date,
        lat,
        lng,
        caseName,
        address,
        city,
        country,
        province,
        zip,
        description,
        violation,
        images: imagesUrl,
        videos: videosUrl,
        status: item.status,
        report: item.report,
        dateClosed: item.dateClosed,
      };

      await updateDoc(caseRef, caseData);
      setLoading(false);
      showSucess("Data updated successfully");
      navigation.navigate(navigationStrings.ACTIVE_CASE);
    } catch (error) {
      console.error("Error updating case data in Firestore: ", error);
      setLoading(false);
    }
  };

  const checkFormCompletion = () => {
    if (
      date &&
      lat &&
      lng &&
      caseName &&
      address &&
      city &&
      country &&
      province &&
      zip &&
      description
    ) {
      setFormCompleted(true);
    } else {
      setFormCompleted(false);
    }
  };

  const pickImage = async () => {
    const maxMedia = 4;
    const results = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    });
    setShowOptionsModal(false);
    if (results.canceled) {
      return;
    }

    let existingSelectedImages = images.slice();
    let existingSelectedVideos = videos.slice();

    for (const result of results.assets) {
      if (result.uri.endsWith(".jpg") || result.uri.endsWith(".png")) {
        existingSelectedImages.push(result);
        const imageUrl = await uploadImageAndVideo(result.uri, "image");
        setImagesUrl((prevUrls) => [...prevUrls, imageUrl]);
      } else if (
        result.uri.endsWith(".mp4") ||
        result.uri.endsWith(".mov") ||
        result.uri.endsWith(".avi")
      ) {
        existingSelectedVideos.push(result);
        const videoUrl = await uploadImageAndVideo(result.uri, "video");
        setVideosUrl((prevUrls) => [...prevUrls, videoUrl]);
      }
    }

    if (existingSelectedImages.length > maxMedia) {
      existingSelectedImages = existingSelectedImages.slice(0, maxMedia);
    }
    if (existingSelectedVideos.length > maxMedia) {
      existingSelectedVideos = existingSelectedVideos.slice(0, maxMedia);
    }

    setImages(existingSelectedImages);
    setVideos(existingSelectedVideos);
  };

  const takePhoto = async () => {
    setShowOptionsModal(false);
    const maxMedia = 4;
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.canceled) {
      return;
    }

    let existingSelectedImages = images.slice();
    let existingSelectedVideos = videos.slice();

    if (result.uri.endsWith(".jpg") || result.uri.endsWith(".png")) {
      existingSelectedImages.push(result);
      const imageUrl = await uploadImageAndVideo(result.uri, "image");
      setImagesUrl((prevUrls) => [...prevUrls, imageUrl]);
    } else if (
      result.uri.endsWith(".mp4") ||
      result.uri.endsWith(".mov") ||
      result.uri.endsWith(".avi")
    ) {
      existingSelectedVideos.push(result);
      const videoUrl = await uploadImageAndVideo(result.uri, "video");
      setVideosUrl((prevUrls) => [...prevUrls, videoUrl]);
    }
    if (existingSelectedImages.length > maxMedia) {
      existingSelectedImages = existingSelectedImages.slice(0, maxMedia);
    }
    if (existingSelectedVideos.length > maxMedia) {
      existingSelectedVideos = existingSelectedVideos.slice(0, maxMedia);
    }

    setImages(existingSelectedImages);
    setVideos(existingSelectedVideos);
  };

  const removeImage = (index) => {
    let updatedImages = images.slice();
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  const removeVideo = (index) => {
    let updatedVideos = videos.slice();
    updatedVideos.splice(index, 1);
    setVideos(updatedVideos);
  };

  const fetchLocationDetails = async () => {
    try {
      const res = await Geocoder.from(address);
      console.log(res);
      const { results } = res;

      if (results.length > 0) {
        const { address_components, geometry } = results[0];

        const { lat, lng } = geometry.location;
        setLat(parseFloat(lat));
        setLng(parseFloat(lng));
        mapViewRef.current.animateToRegion({
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });

        const city = address_components.find((component) =>
          component.types.includes("locality")
        ).long_name;
        setCity(city);

        const province = address_components.find((component) =>
          component.types.includes("administrative_area_level_1")
        ).long_name;
        setProvince(province);

        const country = address_components.find((component) =>
          component.types.includes("country")
        ).long_name;
        setCountry(country);

        const zipCode = address_components.find((component) =>
          component.types.includes("postal_code")
        );
        setZip(zipCode ? zipCode.long_name : "");
      }
    } catch (error) {
      console.error("Error fetching location details: ", error);
    }
  };

  const handleCurrentDate = () => {
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);
    setDate(formattedDate);
  };

  const formatDate = (date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month.toString().padStart(2, "0")}/${day
      .toString()
      .padStart(2, "0")}/${year}`;
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

  const onEndEditingLocation = () => {
    fetchLocationDetails();
  };

  const handleMapPress = async (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLat(latitude);
    setLng(longitude);

    try {
      const response = await Geocoder.from(latitude, longitude);
      const { results } = response;

      if (results.length > 0) {
        const address = results[0];
        const city =
          address.address_components.find((component) =>
            component.types.includes("locality")
          )?.long_name || "N/A";
        setCity(city);
        const country =
          address.address_components.find((component) =>
            component.types.includes("country")
          )?.long_name || "N/A";
        setCountry(country);
        const province =
          address.address_components.find((component) =>
            component.types.includes("administrative_area_level_1")
          )?.long_name || "N/A";
        setProvince(province);
        const zipCode =
          address.address_components.find((component) =>
            component.types.includes("postal_code")
          )?.long_name || "N/A";
        setZip(zipCode);
        const locationName = address.formatted_address;
        setAddress(locationName);
      }
    } catch (error) {
      console.error("Error in reverse geocoding: ", error);
    }
  };

  const handleMarkerDragEnd = async (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLat(latitude);
    setLng(longitude);

    try {
      const response = await Geocoder.from(latitude, longitude);
      const { results } = response;

      if (results.length > 0) {
        const address = results[0];
        const city =
          address.address_components.find((component) =>
            component.types.includes("locality")
          )?.long_name || "N/A";
        setCity(city);
        const country =
          address.address_components.find((component) =>
            component.types.includes("country")
          )?.long_name || "N/A";
        setCountry(country);
        const province =
          address.address_components.find((component) =>
            component.types.includes("administrative_area_level_1")
          )?.long_name || "N/A";
        setProvince(province);
        const zipCode =
          address.address_components.find((component) =>
            component.types.includes("postal_code")
          )?.long_name || "N/A";
        setZip(zipCode);
        const locationName = address.formatted_address;
        setAddress(locationName);
      }
    } catch (error) {
      console.error("Error in reverse geocoding: ", error);
    }
  };

  const renderViolationItems = () => {
    return constants.violations.map((item, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => {
          setViolation(item.violation), setShowDropDown(false);
        }}
        activeOpacity={0.8}
        style={[
          styles.itemContainer,
          {
            borderBottomWidth:
              index === constants.violations.length - 1 ? 0 : 0.4,
          },
        ]}
      >
        <Text style={styles.itemText}>
          {item.id}: {item.violation}
        </Text>
      </TouchableOpacity>
    ));
  };

  // Renderers

  function renderSubmitButton() {
    if (formCompleted) {
      return (
        <TouchableOpacity
          onPress={updateData}
          activeOpacity={0.8}
          style={styles.submitButton}
        >
          {loading ? (
            <ActivityIndicator size={"small"} color={colors.primary} />
          ) : (
            <Text style={styles.submitText}>Update</Text>
          )}
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  }

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
          <Text style={styles.city}>{item.caseName}</Text>
        </View>
      </View>
    );
  }

  function renderMaps() {
    return (
      <MapView
        mapType="satellite"
        onLongPress={handleMapPress}
        ref={mapViewRef}
        region={region}
        provider={PROVIDER_GOOGLE}
        style={styles.mapStyle}
      >
        {lat && lng && (
          <Marker
            coordinate={{ latitude: lat, longitude: lng }}
            draggable={true}
            onDragEnd={handleMarkerDragEnd}
          />
        )}
        {item.lat && item.lng && (
          <Marker
            coordinate={{ latitude: item.lat, longitude: item.lng }}
            draggable={true}
            onDragEnd={handleMarkerDragEnd}
          />
        )}
      </MapView>
    );
  }

  function renderListOfViolation() {
    return <View style={styles.bigContainer}>{renderViolationItems()}</View>;
  }

  function renderViolationContainer() {
    return (
      <View style={styles.chooseFromMaps}>
        <Text style={styles.chFM}>Violation</Text>
        <TouchableOpacity
          onPress={() => setShowDropDown(!showDropDown)}
          activeOpacity={0.8}
          style={[
            styles.violationContainer,
            {
              borderBottomLeftRadius: showDropDown ? 0 : moderateScale(18),
              borderBottomRightRadius: showDropDown ? 0 : moderateScale(18),
            },
          ]}
        >
          {violation == "" ? (
            <Text
              style={[
                styles.chooseStyle,
                {
                  color: showDropDown ? colors.black : "#807f7f",
                },
              ]}
            >
              Choose Violation
            </Text>
          ) : (
            <Text
              style={[
                styles.chooseStyle,
                {
                  color: colors.black,
                },
              ]}
            >
              {violation}
            </Text>
          )}
          {showDropDown ? (
            <AntDesign name="caretup" size={14} color="black" />
          ) : (
            <AntDesign name="caretdown" size={14} color="black" />
          )}
        </TouchableOpacity>
      </View>
    );
  }

  function renderMediaFiles() {
    return (
      <View style={styles.chooseFromMaps}>
        <Text style={styles.chFM}>Media Files (up to 4 files)</Text>
        <View style={{ flexDirection: "row" }}>
          {images.length + videos.length === 4 ? null : (
            <TouchableOpacity
              onPress={() => setShowOptionsModal(true)}
              activeOpacity={0.8}
              style={styles.mediaBox}
            >
              <AntDesign name="plus" size={24} color="black" />
            </TouchableOpacity>
          )}
          {images.map((image, index) => (
            <View key={index}>
              <Image source={{ uri: image.uri }} style={styles.imageStyle} />
              <TouchableOpacity
                style={styles.crossIconStyle}
                onPress={() => removeImage(index)}
              >
                <Entypo name="circle-with-cross" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ))}
          {videos.map((video, index) => (
            <View key={index}>
              <Video
                source={{ uri: video.uri }}
                style={styles.imageStyle}
                useNativeControls
                resizeMode="contain"
              />
              <TouchableOpacity
                style={styles.crossIconStyle}
                onPress={() => removeVideo(index)}
              >
                <Entypo name="circle-with-cross" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    );
  }

  function optionsModal() {
    return (
      <Modal
        onBackdropPress={() => setShowOptionsModal(false)}
        isVisible={showOptionsModal}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            onPress={pickImage}
            activeOpacity={0.8}
            style={styles.layout}
          >
            <AntDesign name="upload" size={30} color="black" />
            <Text style={styles.textStyle}>Upload from gallery </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={takePhoto}
            activeOpacity={0.8}
            style={styles.layout}
          >
            <AntDesign name="camerao" size={30} color="black" />
            <Text style={styles.textStyle}>Take photo</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <KeyboardAwareScrollView
        contentContainerStyle={{
          paddingBottom: verticalScale(50),
        }}
        showsVerticalScrollIndicator={false}
      >
        <FormInput
          value={caseName}
          label="Name"
          placeholder="Enter case name"
          onChangeText={(text) => setCaseName(text)}
        />
        <FormInput
          editable={false}
          value={date}
          label="Date"
          placeholder="mm/dd/yy"
          onChangeText={(text) => setDate(text)}
          customStyling={{
            color: "#807f7f",
          }}
        />
        <FormInput
          onSubmitEditing={onEndEditingLocation}
          value={address}
          containerStyle={styles.containerStyle2}
          label="Address"
          placeholder="Enter location"
          onChangeText={(text) => setAddress(text)}
        />
        <FormInput
          value={city}
          containerStyle={styles.containerStyle2}
          label="City"
          placeholder="Enter city"
          onChangeText={(text) => setCity(text)}
        />
        <FormInput
          value={country}
          containerStyle={styles.containerStyle2}
          label="Country"
          placeholder="Enter country"
          onChangeText={(text) => setCountry(text)}
        />
        <View style={styles.twoInputLayout}>
          <FormInput
            value={province}
            containerStyle={styles.containerStyle}
            label="State"
            placeholder="Enter state"
            onChangeText={(text) => setProvince(text)}
          />
          <FormInput
            value={zip}
            containerStyle={styles.containerStyle}
            label="Zip code"
            placeholder="Enter zip"
            onChangeText={(text) => setZip(text)}
          />
        </View>
        <View style={styles.twoInputLayout}>
          <FormInput
            value={lat !== null ? lat.toString() : ""}
            containerStyle={styles.containerStyle}
            label="Latitude"
            placeholder="Enter Lat"
            onChangeText={(text) => setLat(text)}
          />
          <FormInput
            value={lng !== null ? lng.toString() : ""}
            containerStyle={styles.containerStyle}
            label="Longitude"
            placeholder="Enter long"
            onChangeText={(text) => setLng(text)}
          />
        </View>
        <View style={styles.chooseFromMaps}>
          <Text style={styles.chFM}>Choose from maps</Text>
          {renderMaps()}
        </View>

        {renderViolationContainer()}
        {showDropDown && renderListOfViolation()}
        <FormInput
          value={description}
          containerStyle={styles.containerStyle2}
          label="Description"
          multiline={true}
          placeholder="Type here..."
          onChangeText={(text) => setDescription(text)}
          customStyling={{
            paddingTop: verticalScale(12),
            textAlignVertical: "top",
          }}
        />
        {renderMediaFiles()}
        {renderSubmitButton()}
        {showOptionsModal && optionsModal()}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default EditActiveCase;
