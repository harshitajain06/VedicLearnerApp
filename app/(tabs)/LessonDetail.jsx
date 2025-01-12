import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview'; // Import WebView to render YouTube videos
import { Ionicons } from '@expo/vector-icons'; // For icons like back and close buttons

const LessonDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { lessonData } = route.params; // Get the lesson data passed via navigation

  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility

  // Function to handle the back action
  const handleBackPress = () => {
    navigation.goBack(); // Go back to the previous screen
  };

  // Function to handle the close action (close the modal or navigate to a specific screen)
  const handleClosePress = () => {
    navigation.navigate('Home'); // Navigate to the Home screen or any other screen
  };

  // Function to open the modal
  const openModal = () => {
    setModalVisible(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lesson Details</Text>
      </View>

      {/* Content Container */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>{lessonData.title}</Text>
        <Text style={styles.description}>{lessonData.description}</Text>

        {/* Button to open the video modal */}
        <TouchableOpacity style={styles.videoButton} onPress={openModal}>
          <Text style={styles.videoButtonText}>Watch Video</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal for YouTube Video */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <WebView
              source={{ uri: lessonData.youtubeLink }} // YouTube video link passed from the previous screen
              style={styles.video}
              javaScriptEnabled={true}
              allowsFullscreenVideo={true}
            />
            <TouchableOpacity style={styles.closeModalButton} onPress={closeModal}>
              <Ionicons name="close-circle" size={40} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F3F7FA', // Light background similar to the Addition page
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#567396', // Soft blue header
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30, // Space for header
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    lineHeight: 24,
    color: '#666',
    marginBottom: 20, // Add space between description and video
    textAlign: 'center',
    width: '80%',
  },
  videoButton: {
    padding: 15,
    backgroundColor: '#567396',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  videoButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent background
  },
  modalContent: {
    width: '90%',
    height: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  video: {
    flex: 1,
  },
  closeModalButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
});

export default LessonDetail;
