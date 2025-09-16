import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../../config/firebase';
import { Ionicons } from '@expo/vector-icons';

const AdvancedOperations = () => {
  const navigation = useNavigation();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLessons = async () => {
    try {
      const db = getFirestore(app);
      const querySnapshot = await getDocs(collection(db, 'advancedLessons'));
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
        <ActivityIndicator size="large" color="#567396" />
        <Text style={styles.loadingText}>Loading lessons...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Module V - Advanced Operations</Text>
      </View>

      {/* Lessons List */}
      <ScrollView contentContainerStyle={styles.lessonsContainer}>
        {lessons.map((lesson, index) => (
          <TouchableOpacity
            key={lesson.id}
            style={[
              styles.lessonButton,
              index % 2 === 0 ? styles.lightBackground : styles.darkBackground,
            ]}
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
    backgroundColor: '#F3F7FA',
    padding: 16,
    paddingTop: 60,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#567396',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    zIndex: 10,
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    flex: 1,
  },
  lessonsContainer: {
    paddingTop: 100,
    paddingBottom: 20,
    alignItems: 'center',
  },
  lessonButton: {
    width: '90%',
    paddingVertical: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  lightBackground: {
    backgroundColor: '#F0FFF0',
    borderColor: '#90EE90',
    borderWidth: 2,
  },
  darkBackground: {
    backgroundColor: '#E6FFE6',
    borderColor: '#7CFC00',
    borderWidth: 2,
  },
  lessonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F7FA',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#567396',
    textAlign: 'center',
  },
});

export default AdvancedOperations;
