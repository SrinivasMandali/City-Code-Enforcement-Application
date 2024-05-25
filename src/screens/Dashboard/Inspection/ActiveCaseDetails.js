import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import styles from "./styles";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../../../constants/colors";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Modal from "react-native-modal";
import {
  moderateScale,
  scale,
  verticalScale,
} from "../../../constants/resposiveSizes";
import FormInput from "../../../components/FormInput";
import { AntDesign } from "@expo/vector-icons";
import constants from "../../../constants/constants";
import { Feather } from "@expo/vector-icons";
import navigationStrings from "../../../constants/navigationStrings";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { showSucess } from "../../../utils/helperFunctions";
import { Video } from "expo-av";
import { Entypo } from "@expo/vector-icons";

const ActiveCaseDetails = ({ navigation, route }) => {
  const { item, key } = route.params;
  const [report, setReport] = useState("");
  const [status, setStatus] = useState("");
  const [dateClosed, setDateClosed] = useState("");
  const [showDropDown, setShowDropDown] = useState(false);
  const [formCompleted, setFormCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    checkFormCompletion();
  }, [report, dateClosed, status]);

  useEffect(() => {
    handleCurrentDate();
  }, []);

  useEffect(() => {
    if (key === "fromInspection" || key === "fromActiveCase") {
      setReport(item.report),
        setStatus(item.status),
        setDateClosed(item.dateClosed);
    }
  }, []);
  // Handlers

  const handleImagePress = (media) => {
    setSelectedImage(media);
  };

  const handleVideoPress = (media) => {
    setSelectedVideo(media);
  };

  const handleCloseImageModal = () => {
    setSelectedImage(null);
  };

  const handleCloseVideoModal = () => {
    setSelectedVideo(null);
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await updateDoc(doc(db, "cases", item.id), {
        report,
        status,
        dateClosed,
      });
      setLoading(false);
      showSucess("Submitted");
    } catch (error) {
      setLoading(false);
      console.error("Error updating data: ", error);
    }
  };

  const renderStatusItems = () => {
    return constants.statuses.map((item, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => {
          setStatus(item.status), setShowDropDown(false);
        }}
        activeOpacity={0.8}
        style={[
          styles.itemContainer,
          {
            borderBottomWidth: index == constants.statuses.length - 1 ? 0 : 0.4,
          },
        ]}
      >
        <Text style={styles.itemText}>
          {item.id}: {item.status}
        </Text>
      </TouchableOpacity>
    ));
  };

  const handleCurrentDate = () => {
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);
    setDateClosed(formattedDate);
  };

  const formatDate = (date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month.toString().padStart(2, "0")}/${day
      .toString()
      .padStart(2, "0")}/${year}`;
  };

  const checkFormCompletion = () => {
    if (report && status && dateClosed) {
      setFormCompleted(true);
    } else {
      setFormCompleted(false);
    }
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
          <Text style={styles.city}>{item.caseName} Details</Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(navigationStrings.ACTIVE_CASE_ON_MAP, {
              item,
            })
          }
          activeOpacity={0.8}
          style={styles.mapShow}
        >
          <Feather name="map-pin" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(navigationStrings.EDIT_ACTIVE_CASE, {
              item,
            })
          }
          activeOpacity={0.8}
          style={[styles.mapShow, { marginLeft: scale(10) }]}
        >
          <AntDesign name="edit" size={24} color="black" />
        </TouchableOpacity>
      </View>
    );
  }

  function renderImageModal() {
    return (
      <Modal visible={selectedImage !== null} transparent={true}>
        <View style={styles.modalContainer2}>
          <TouchableOpacity
            style={styles.closeButton2}
            onPress={handleCloseImageModal}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          <ScrollView contentContainerStyle={styles.mediaScrollView} horizontal>
            {selectedImage &&
              selectedImage.map((image, index) => (
                <View key={index} style={styles.mediaContainer}>
                  <Image
                    source={{ uri: image.downloadUrl }}
                    style={styles.mediaImage}
                  />
                </View>
              ))}
          </ScrollView>
        </View>
      </Modal>
    );
  }

  function renderVideoModal() {
    return (
      <Modal visible={selectedVideo !== null} transparent={true}>
        <View style={styles.modalContainer2}>
          <TouchableOpacity
            style={styles.closeButton2}
            onPress={handleCloseVideoModal}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          <ScrollView contentContainerStyle={styles.mediaScrollView} horizontal>
            {selectedVideo &&
              selectedVideo.map((video, index) => (
                <View key={index} style={styles.mediaContainer}>
                  <Video
                    source={{ uri: video.downloadUrl }}
                    style={styles.mediaVideo}
                    useNativeControls
                    resizeMode="contain"
                  />
                </View>
              ))}
          </ScrollView>
        </View>
      </Modal>
    );
  }

  function renderCaseDetails() {
    return (
      <>
        <View style={styles.details}>
          <Text style={styles.oneTextStyle}>Date</Text>
          <View style={styles.detailsLines}>
            <Text style={styles.oneTextStyle}>{item.date}</Text>
          </View>
        </View>
        <View style={styles.details}>
          <Text style={styles.oneTextStyle}>Address</Text>
          <View style={styles.detailsLines}>
            <Text style={styles.oneTextStyle}>{item.address}</Text>
          </View>
        </View>
        <View style={styles.details}>
          <Text style={styles.oneTextStyle}>Violation</Text>
          <View style={styles.detailsLines}>
            <Text style={styles.oneTextStyle}>{item.violation}</Text>
          </View>
        </View>
        <View style={styles.details}>
          <Text style={styles.oneTextStyle}>Description</Text>
          <View style={styles.detailsLines}>
            <Text style={styles.oneTextStyle}>{item.description}</Text>
          </View>
        </View>
        <View style={styles.details}>
          <Text style={styles.oneTextStyle}>Media Files</Text>
          <View style={styles.detailsLines}>
            {item.images.length + item.videos.length === 0 ? (
              <View>
                <Text style={styles.oneTextStyle}>No media</Text>
              </View>
            ) : (
              <>
                {item.images.map((image, index) => (
                  <TouchableOpacity
                    onPress={() =>
                      handleImagePress([...item.images, ...item.videos])
                    }
                    activeOpacity={0.8}
                    key={index}
                  >
                    <Image
                      source={{ uri: image.downloadUrl }}
                      style={styles.imageStyle}
                    />
                  </TouchableOpacity>
                ))}
                {item.videos.map((video, index) => (
                  <TouchableOpacity
                    onPress={() =>
                      handleVideoPress([...item.images, ...item.videos])
                    }
                    key={index}
                  >
                    <Video
                      source={{ uri: video.downloadUrl }}
                      style={styles.imageStyle}
                      useNativeControls
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                ))}
              </>
            )}
          </View>
        </View>
      </>
    );
  }

  function renderStatus() {
    return (
      <View style={styles.chooseFromMaps}>
        <Text style={styles.oneTextStyle}>Status</Text>
        <TouchableOpacity
          disabled={
            key == "fromInspection" || key === "fromActiveCase" ? true : false
          }
          onPress={() => {
            key == "fromInspection" || key === "fromActiveCase"
              ? setShowDropDown(false)
              : setShowDropDown(!showDropDown);
          }}
          activeOpacity={0.8}
          style={[
            styles.violationContainer,
            {
              borderBottomLeftRadius: showDropDown ? 0 : moderateScale(18),
              borderBottomRightRadius: showDropDown ? 0 : moderateScale(18),
            },
          ]}
        >
          {status == "" ? (
            <Text
              style={[
                styles.chooseStyle,
                {
                  color: showDropDown ? colors.black : "#807f7f",
                },
              ]}
            >
              Choose Status
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
              {status}
            </Text>
          )}
          {key === "fromInspection" ||
          key == "fromActiveCase" ? null : showDropDown ? (
            <AntDesign name="caretup" size={14} color="black" />
          ) : (
            <AntDesign name="caretdown" size={14} color="black" />
          )}
        </TouchableOpacity>
      </View>
    );
  }

  function renderSubmitButton() {
    if (formCompleted) {
      return (
        <TouchableOpacity
          onPress={handleUpdate}
          activeOpacity={0.8}
          style={[
            styles.submitButton,
            {
              marginTop: verticalScale(20),
            },
          ]}
        >
          {loading ? (
            <ActivityIndicator size={"small"} color={colors.primary} />
          ) : (
            <Text style={styles.submitText}>Submit</Text>
          )}
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  }

  function renderListOfStatus() {
    return <View style={styles.bigContainer}>{renderStatusItems()}</View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: verticalScale(50),
        }}
      >
        {renderCaseDetails()}

        <FormInput
          value={report}
          onChangeText={(text) => setReport(text)}
          multiline={true}
          placeholder="Type here..."
          label="Report"
          customLabelStyle={styles.oneTextStyle}
          customStyling={{
            paddingTop: verticalScale(12),
            textAlignVertical: "top",
          }}
          containerStyle={{
            marginTop: verticalScale(10),
          }}
        />

        <FormInput
          editable={false}
          value={dateClosed}
          onChangeText={(text) => setDateClosed(text)}
          placeholder="mm/dd/yy"
          label="Date Closed"
          customLabelStyle={styles.oneTextStyle}
          customStyling={{
            color: "#807f7f",
          }}
          containerStyle={{
            marginTop: verticalScale(10),
          }}
        />
        {renderStatus()}
        {showDropDown && renderListOfStatus()}
      </KeyboardAwareScrollView>
      {key == "fromInspection" || key == "fromActiveCase"
        ? null
        : renderSubmitButton()}
      {renderImageModal()}
      {renderVideoModal()}
    </SafeAreaView>
  );
};

export default ActiveCaseDetails;
