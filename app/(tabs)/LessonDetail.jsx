import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Platform, Linking, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview'; // Import WebView to render YouTube videos
import { Ionicons } from '@expo/vector-icons'; // For icons like back and close buttons
import * as WebBrowser from 'expo-web-browser';

const LessonDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { lessonData } = route.params; // Get the lesson data passed via navigation

  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility

  // Function to extract YouTube video ID from various URL formats
  const getYouTubeVideoId = (url) => {
    if (!url) return '';
    
    // If it's already an embed URL, extract the video ID
    if (url.includes('/embed/')) {
      return url.split('/embed/')[1].split('?')[0];
    }
    
    // Extract video ID from various YouTube URL formats
    let videoId = '';
    
    // Format: https://www.youtube.com/watch?v=VIDEO_ID
    if (url.includes('watch?v=')) {
      videoId = url.split('watch?v=')[1].split('&')[0];
    }
    // Format: https://youtu.be/VIDEO_ID
    else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    }
    // Format: https://www.youtube.com/v/VIDEO_ID
    else if (url.includes('/v/')) {
      videoId = url.split('/v/')[1].split('?')[0];
    }
    
    return videoId;
  };

  // Function to convert YouTube URL to embed format with proper parameters
  const getYouTubeEmbedUrl = (url) => {
    const videoId = getYouTubeVideoId(url);
    if (!videoId) return '';
    
    // Use youtube-nocookie.com to avoid cookie/Referer issues
    // Return embed URL with proper parameters for mobile
    return `https://www.youtube-nocookie.com/embed/${videoId}?playsinline=1&enablejsapi=1&rel=0&modestbranding=1&origin=https://vediclearner.app`;
  };

  // Function to create HTML wrapper for WebView with proper Referer handling
  const getYouTubeHTML = (url) => {
    const embedUrl = getYouTubeEmbedUrl(url);
    if (!embedUrl) return '';
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              margin: 0;
              padding: 0;
              background-color: #000;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
            }
            iframe {
              width: 100%;
              height: 100%;
            }
          </style>
        </head>
        <body>
          <iframe
            src="${embedUrl}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            referrerpolicy="strict-origin-when-cross-origin"
          ></iframe>
        </body>
      </html>
    `;
  };

  // Function to open YouTube video in external app/browser
  const openYouTubeInBrowser = async () => {
    const videoId = getYouTubeVideoId(lessonData.youtubeLink);
    if (videoId) {
      const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
      try {
        // Try to open in YouTube app first, fallback to browser
        await Linking.openURL(youtubeUrl);
      } catch (err) {
        console.error('Error opening YouTube:', err);
        // Fallback to WebBrowser
        WebBrowser.openBrowserAsync(youtubeUrl);
      }
    }
  };

  // Function to handle video button press - on mobile, open directly in YouTube
  const handleVideoPress = () => {
    if (Platform.OS === 'web') {
      openModal();
    } else {
      // On mobile, open directly in YouTube app/browser for better experience
      openYouTubeInBrowser();
    }
  };

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

        {/* Button to open the video modal or YouTube app */}
        <TouchableOpacity style={styles.videoButton} onPress={handleVideoPress}>
          <Ionicons name="play-circle" size={24} color="#fff" style={{ marginRight: 8 }} />
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
            {Platform.OS === 'web' ? (
              <iframe
                src={getYouTubeEmbedUrl(lessonData.youtubeLink)}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <View style={styles.mobileVideoContainer}>
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={60} color="#FF6B6B" />
                  <Text style={styles.errorTitle}>Video Player Error</Text>
                  <Text style={styles.errorMessage}>
                    YouTube videos cannot be embedded in the app. Please watch the video on YouTube.
                  </Text>
                  <TouchableOpacity 
                    style={styles.youtubeButton} 
                    onPress={openYouTubeInBrowser}
                  >
                    <Ionicons name="logo-youtube" size={24} color="#fff" />
                    <Text style={styles.youtubeButtonText}>Watch on YouTube</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            <TouchableOpacity style={styles.closeModalButton} onPress={closeModal}>
              <Ionicons name="close-circle" size={40} color="#567396" />
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
    flexDirection: 'row',
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
  mobileVideoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    width: '90%',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  closeModalButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  youtubeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF0000',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  youtubeButtonText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LessonDetail;
