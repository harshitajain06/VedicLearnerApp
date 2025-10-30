import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal } from 'react-native';

const DivPractice = ({ navigation }) => {
  const [question, setQuestion] = useState(generateQuestion());
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);

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
      setModalTitle('Correct!');
      setModalMessage('You selected the right answer.');
      setIsCorrect(true);
      setModalVisible(true);
    } else {
      setModalTitle('Incorrect');
      setModalMessage('That is not the correct answer.');
      setIsCorrect(false);
      setModalVisible(true);
    }
  };

  const handleNextQuestion = () => {
    setModalVisible(false);
    setQuestion(generateQuestion());
  };

  const handleTryAgain = () => {
    setModalVisible(false);
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

      {/* Modal for feedback */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <View style={styles.modalButtonContainer}>
              {isCorrect ? (
                <TouchableOpacity
                  style={[styles.modalButton, styles.nextButton]}
                  onPress={handleNextQuestion}
                >
                  <Text style={styles.modalButtonText}>Next Question</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.modalButton, styles.tryAgainButton]}
                  onPress={handleTryAgain}
                >
                  <Text style={styles.modalButtonText}>Try Again</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 300,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 25,
    textAlign: 'center',
    color: '#666',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  nextButton: {
    backgroundColor: '#4CAF50',
  },
  tryAgainButton: {
    backgroundColor: '#FF9800',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DivPractice;
