import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const TrackPage = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Track Page</Text>
      <Button 
        title="Go to Practice"
        onPress={() => navigation.navigate('Practice')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCE9FE',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#567396',
  },
});

export default TrackPage;
