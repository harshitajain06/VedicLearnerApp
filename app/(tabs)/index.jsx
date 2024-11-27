import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const WelcomePage = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('../../assets/images/Logo.png')} style={styles.logo} />

      {/* Welcome Text */}
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>Get ready to be a math star!</Text>

      {/* Signup Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Register')}>
        <Text style={styles.buttonText}>SignUp</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity
        style={[styles.button, styles.loginButton]}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8', // Soft background color
    paddingHorizontal: 20,
  },
  logo: {
    width: 180, // Adjusted for better visibility
    height: 180,
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 20,
    color: '#666',
    marginBottom: 50,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4a90e2', // Primary button color
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // for Android shadow
  },
  loginButton: {
    backgroundColor: '#f5a623', // Differentiated color for login button
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default WelcomePage;
