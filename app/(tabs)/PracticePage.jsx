import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PracticePage = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Practice</Text>
        {/* Logo */}
      </View>
      <ScrollView contentContainerStyle={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.addition]}
          onPress={() => navigation.navigate('AddPractice')}
        >
          <Text style={styles.buttonText}>Practice Addition</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.subtraction]}
          onPress={() => navigation.navigate('SubPractice')}
        >
          <Text style={styles.buttonText}>Practice Subtraction</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.multiplication]}
          onPress={() => navigation.navigate('MulPractice')}
        >
          <Text style={styles.buttonText}>Practice Multiplication</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.division]}
          onPress={() => navigation.navigate('DivPractice')}
        >
          <Text style={styles.buttonText}>Practice Division</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F7FA',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#567396',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  buttonContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    marginLeft: 25
  },
  button: {
    width: '90%',
    paddingVertical: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginVertical: 15,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addition: {
    borderColor: '#FFB6C1',
    backgroundColor: '#FFF0F5',
  },
  subtraction: {
    borderColor: '#FFD700',
    backgroundColor: '#FFFACD',
  },
  multiplication: {
    borderColor: '#7FFFD4',
    backgroundColor: '#E0FFFF',
  },
  division: {
    borderColor: '#ADD8E6',
    backgroundColor: '#E6F7FF',
  },
  advanced: {
    borderColor: '#90EE90',
    backgroundColor: '#F0FFF0',
  },
});

export default PracticePage;