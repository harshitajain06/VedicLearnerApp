import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import YoutubeIframe from "react-native-youtube-iframe";

const LessonDetail = () => {
  const route = useRoute();
  const { lessonData } = route.params;

  const [modalVisible, setModalVisible] = useState(false);

  /** Extract YouTube ID */
  const getYouTubeVideoId = (url) => {
    if (!url) return "";
    if (url.includes("watch?v=")) return url.split("watch?v=")[1].split("&")[0];
    if (url.includes("youtu.be/")) return url.split("youtu.be/")[1].split("?")[0];
    if (url.includes("/embed/")) return url.split("/embed/")[1].split("?")[0];
    return "";
  };

  const videoId = getYouTubeVideoId(lessonData.youtubeLink);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lesson Details</Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>{lessonData.title}</Text>
        <Text style={styles.description}>{lessonData.description}</Text>

        <TouchableOpacity style={styles.videoButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="play-circle" size={24} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.videoButtonText}>Watch Video</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* VIDEO MODAL */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>

            {/* WORKING YOUTUBE PLAYER */}
            <YoutubeIframe
              height={300}
              play={true}
              videoId={videoId}
              webViewProps={{
                allowsInlineMediaPlayback: true,
              }}
            />

            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close-circle" size={40} color="#567396" />
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
    </View>
  );
};

/** Styles */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F3F7FA" },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 20,
    backgroundColor: "#567396",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  contentContainer: { paddingTop: 30, paddingBottom: 20, alignItems: "center" },
  title: { fontSize: 28, fontWeight: "bold", color: "#333", marginBottom: 20 },
  description: {
    fontSize: 18,
    lineHeight: 24,
    color: "#666",
    marginBottom: 20,
    width: "80%",
    textAlign: "center",
  },
  videoButton: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#567396",
    borderRadius: 10,
    alignItems: "center",
  },
  videoButtonText: { fontSize: 18, color: "#fff", fontWeight: "bold" },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    height: "50%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
  },
  closeModalButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 999,
  },
});

export default LessonDetail;
