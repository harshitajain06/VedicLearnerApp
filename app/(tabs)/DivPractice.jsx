import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';

const DivPractice = ({ navigation }) => {
  const [question, setQuestion] = useState(generateQuestion());

  // Generate a random division question
  function generateQuestion() {
    const divisor = Math.floor(Math.random() * 10) + 2; // Random number between 2 and 11
    const quotient = Math.floor(Math.random() * 10) + 1; // Random number between 1 and 10
    const dividend = divisor * quotient; // Ensure clean division
    const correctAnswer = quotient;

    // Generate three random wrong answers
    const wrongAnswers = new Set();
    while (wrongAnswers.size < 3) {
      const randomAnswer = correctAnswer + Math.floor(Math.random() * 6) - 3;
      if (randomAnswer !== correctAnswer && randomAnswer > 0) {
        wrongAnswers.add(randomAnswer);
      }
    }

    const options = [...wrongAnswers, correctAnswer].sort(() => Math.random() - 0.5); // Shuffle options
    return { dividend, divisor, correctAnswer, options };
  }

  const handleOptionPress = (option) => {
    if (option === question.correctAnswer) {
      Alert.alert('Correct!', 'You selected the right answer.', [
        { text: 'Next Question', onPress: () => setQuestion(generateQuestion()) },
      ]);
    } else {
      Alert.alert('Incorrect', 'That is not the correct answer.', [
        { text: 'Try Again' },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Division Practice</Text>
      </View>

      {/* Question Box */}
      <View style={styles.questionBox}>
        <Text style={styles.questionText}>
          What is {question.dividend} ÷ {question.divisor}?
        </Text>
      </View>

      {/* Answer Options */}
      <ScrollView contentContainerStyle={styles.optionsContainer}>
        {question.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.optionButton, styles[`option${index + 1}`]]}
            onPress={() => handleOptionPress(option)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
        {/* Back to Practice Page */}
        <TouchableOpacity
          style={[styles.button, styles.home]}
          onPress={() =>
            navigation.navigate('Drawer', {
              screen: 'MainTabs',
              params: { screen: 'Practice' },
            })
          }
        >
          <Text style={styles.buttonText}>Back to Practice Page</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#006666',
  },
  header: {
    paddingTop: 40,
    paddingBottom: 40,
    backgroundColor: '#567396',
    alignItems: 'center',
    marginBottom: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  questionBox: {
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#00291b',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 20,
    marginRight: 20,
    marginLeft: 20,
  },
  questionText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  optionsContainer: {
    flexGrow: 1,
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
    marginLeft: 20,
    marginRight: 20
  },
  optionButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  option1: {
    backgroundColor: '#ffe600',
  },
  option2: {
    backgroundColor: '#ffa600',
  },
  option3: {
    backgroundColor: '#ff5500',
  },
  option4: {
    backgroundColor: '#ff0000',
  },
  optionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  home: {
    backgroundColor: '#212121',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default DivPractice;
