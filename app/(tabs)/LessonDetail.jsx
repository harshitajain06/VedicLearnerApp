import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
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
      <View style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity onPress={handleBackPress} style={styles.button}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        
        
      </View>

      <Text style={styles.title}>{lessonData.title}</Text>

      <View style={styles.contentContainer}>
        {/* Display the description */}
        <Text style={styles.description}>{lessonData.description}</Text>

        {/* Button to open the video modal */}
        <TouchableOpacity style={styles.videoButton} onPress={openModal}>
          <Text style={styles.videoButtonText}>Watch Video</Text>
        </TouchableOpacity>
      </View>

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
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    zIndex: 1, // Ensure the header is above the content
    marginTop: 50,
  },
  button: {
    backgroundColor: '#567396',
    padding: 10,
    borderRadius: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50, // To leave space for the header
    marginBottom: 20,
    color: '#333',
  },
  contentContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  description: {
    fontSize: 18,
    lineHeight: 24,
    color: '#666',
    marginBottom: 20, // Add space between description and video
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
