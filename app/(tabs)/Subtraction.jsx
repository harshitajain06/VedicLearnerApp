import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../../config/firebase'; // Adjust the path to your Firebase configuration
import { Ionicons } from '@expo/vector-icons'; // For icons like back and close buttons

const Addition = () => {
  const navigation = useNavigation();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLessons = async () => {
    try {
      const db = getFirestore(app);
      const querySnapshot = await getDocs(collection(db, 'subtractionLessons')); // Ensure your collection is named 'additionLessons'
      const lessonsList = [];
      querySnapshot.forEach((doc) => {
        lessonsList.push({ id: doc.id, ...doc.data() });
      });
      setLessons(lessonsList);
    } catch (error) {
      console.error('Error fetching lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2B5D73" />
        <Text style={styles.loadingText}>Loading lessons...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subtraction</Text>
      </View>

      {/* Lessons List */}
      <ScrollView contentContainerStyle={styles.lessonsContainer}>
        {lessons.map((lesson) => (
          <TouchableOpacity
            key={lesson.id}
            style={styles.lessonButton}
            onPress={() => navigation.navigate('LessonDetail', { lessonId: lesson.id, lessonData: lesson })}
          >
            <Text style={styles.lessonText}>{lesson.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F7F7F7', // Neutral background
    marginTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10,
    marginBottom: 20,
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    zIndex: 1, // Ensure header is above the content
  },
  button: {
    backgroundColor: '#567396',
    padding: 10,
    borderRadius: 50,
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginLeft: 15,
    color: '#333',
    fontFamily: 'Helvetica Neue', // Clean font
  },
  lessonsContainer: {
    alignItems: 'center',
    paddingTop: 70, // Leave space for the header
    paddingBottom: 20,
  },
  lessonButton: {
    width: '90%',
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginVertical: 12,
    borderRadius: 8,
    backgroundColor: '#567396', // Soft blue background
    borderColor: '#3A7D99', // Slightly darker blue border
    borderWidth: 1,
    elevation: 4, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lessonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'Helvetica Neue', // Clean font for readability
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#2B5D73',
    fontFamily: 'Helvetica Neue',
  },
});

export default Addition;
