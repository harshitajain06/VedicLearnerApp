import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const Modules = () => {
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Modules</Text>
      </View>

      {/* Colorful Buttons */}
      <ScrollView contentContainerStyle={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.addition]}>
          <Text style={styles.buttonText}>Module I - Addition</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.subtraction]}>
          <Text style={styles.buttonText}>Module II - Subtraction</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.multiplication]}>
          <Text style={styles.buttonText}>Module III - Multiplication</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.division]}>
          <Text style={styles.buttonText}>Module IV - Division</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.advanced]}>
          <Text style={styles.buttonText}>Module V - Advanced Operations</Text>
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
    marginBottom: 20,
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
  button: {
    width: '90%',
    paddingVertical: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginVertical: 10,
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
  // Color styles for each button
  addition: {
    borderColor: '#FFB6C1',
    backgroundColor: '#FFF0F5',
    color: '#FF69B4',
  },
  subtraction: {
    borderColor: '#FFD700',
    backgroundColor: '#FFFACD',
    color: '#DAA520',
  },
  multiplication: {
    borderColor: '#7FFFD4',
    backgroundColor: '#E0FFFF',
    color: '#20B2AA',
  },
  division: {
    borderColor: '#ADD8E6',
    backgroundColor: '#E6F7FF',
    color: '#4682B4',
  },
  advanced: {
    borderColor: '#90EE90',
    backgroundColor: '#F0FFF0',
    color: '#32CD32',
  },
});

export default Modules;
