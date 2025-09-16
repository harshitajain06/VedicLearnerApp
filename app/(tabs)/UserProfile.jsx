import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, ActivityIndicator, Modal, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/firebase';
import { deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { doc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

const UserProfile = () => {
  const [user, loading, error] = useAuthState(auth);
  const navigation = useNavigation();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [password, setPassword] = useState('');

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigation.replace('Register');
  };

  // Debug modal state changes
  useEffect(() => {
    console.log('Modal state changed:', showSuccessModal);
  }, [showSuccessModal]);

  const handleDeleteAccount = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    if (password && password.trim()) {
      setShowConfirmModal(false);
      deleteUserAccount(password);
    } else {
      Alert.alert('Error', 'Password is required to delete account.');
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setPassword('');
  };

  const deleteUserAccount = async (password) => {
    if (!user) {
      console.log('No user found, cannot delete account');
      return;
    }

    console.log('Starting account deletion process...');
    setIsDeleting(true);
    
    try {
      console.log('Step 1: Re-authenticating user...');
      // Re-authenticate user before deletion
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
      console.log('Step 1: Re-authentication successful');

      console.log('Step 2: Deleting user data from Firestore...');
      // Delete user data from Firestore collections
      await deleteUserData();
      console.log('Step 2: User data deleted successfully');

      console.log('Step 3: Deleting user account from Firebase Auth...');
      // Delete the user account
      await deleteUser(user);
      console.log('Step 3: User account deleted successfully');

      // Show success modal
      console.log('Step 4: Setting modal state to true...');
      setShowSuccessModal(true);
      console.log('Step 4: Modal state set to true');
    } catch (error) {
      console.error('Error during account deletion:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Full error object:', JSON.stringify(error, null, 2));
      
      let errorMessage = 'Failed to delete account. Please try again.';
      
      switch (error.code) {
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password. Please try again.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          break;
        case 'auth/requires-recent-login':
          errorMessage = 'Please log out and log back in, then try again.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your internet connection.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many requests. Please try again later.';
          break;
        default:
          errorMessage = error.message || errorMessage;
      }

      console.error('Final error message:', errorMessage);
      Alert.alert('Error', errorMessage);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
      });
    } finally {
      console.log('Account deletion process completed, setting isDeleting to false');
      setIsDeleting(false);
    }
  };

  const deleteUserData = async () => {
    if (!user) return;

    try {
      // Delete user's progress data
      const progressQuery = query(
        collection(db, 'userProgress'),
        where('userId', '==', user.uid)
      );
      const progressSnapshot = await getDocs(progressQuery);
      const progressPromises = progressSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(progressPromises);

      // Delete user's practice history
      const practiceQuery = query(
        collection(db, 'practiceHistory'),
        where('userId', '==', user.uid)
      );
      const practiceSnapshot = await getDocs(practiceQuery);
      const practicePromises = practiceSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(practicePromises);

      // Delete user's settings
      const settingsQuery = query(
        collection(db, 'userSettings'),
        where('userId', '==', user.uid)
      );
      const settingsSnapshot = await getDocs(settingsQuery);
      const settingsPromises = settingsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(settingsPromises);

      console.log('User data deleted successfully');
    } catch (error) {
      console.error('Error deleting user data:', error);
      // Don't throw error here as we still want to delete the account
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#567396" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No user logged in</Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Account Settings</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* User Info */}
          <View style={styles.userInfoSection}>
            <View style={styles.userInfoCard}>
              <Ionicons name="person-circle" size={60} color="#567396" />
              <Text style={styles.userEmail}>{user.email}</Text>
              <Text style={styles.userId}>User ID: {user.uid.substring(0, 8)}...</Text>
            </View>
          </View>

          {/* Account Actions */}
          <View style={styles.actionsSection}>
            <Text style={styles.sectionTitle}>Account Actions</Text>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="trash" size={20} color="#fff" />
              )}
              <Text style={styles.deleteButtonText}>
                {isDeleting ? 'Deleting Account...' : 'Delete Account'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.warningText}>
              ⚠️ Deleting your account will permanently remove all your data, progress, and settings. This action cannot be undone.
            </Text>
          </View>

          {/* App Info */}
          <View style={styles.appInfoSection}>
            <Text style={styles.sectionTitle}>App Information</Text>
            <View style={styles.infoCard}>
              <Text style={styles.infoText}>VedicLearner v1.0.0</Text>
              <Text style={styles.infoText}>Created by Aditya Arora</Text>
            </View>
          </View>
        </ScrollView>

        <Toast />
      </View>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelDelete}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalIconContainer}>
              <Ionicons name="warning" size={60} color="#dc3545" />
            </View>
            <Text style={styles.modalTitle}>Delete Account</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to permanently delete your account? This action cannot be undone and all your data will be lost.
            </Text>
            
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter your password to confirm"
              placeholderTextColor="#666"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              autoFocus
            />
            
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancelDelete}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteModalButton]}
                onPress={handleConfirmDelete}
                disabled={!password.trim()}
              >
                <Text style={styles.deleteModalButtonText}>Delete Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal - Moved outside main container */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleSuccessModalClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalIconContainer}>
              <Ionicons name="checkmark-circle" size={60} color="#28a745" />
            </View>
            <Text style={styles.modalTitle}>Account Deleted Successfully</Text>
            <Text style={styles.modalMessage}>
              Your account and all associated data have been permanently deleted. Thank you for using VedicLearner!
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleSuccessModalClose}
            >
              <Text style={styles.modalButtonText}>Create New Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F7FA',
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
  content: {
    paddingTop: 100,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  userInfoSection: {
    marginBottom: 30,
  },
  userInfoCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userEmail: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    textAlign: 'center',
  },
  userId: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  actionsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  warningText: {
    fontSize: 14,
    color: '#dc3545',
    textAlign: 'center',
    lineHeight: 20,
    backgroundColor: '#f8d7da',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f5c6cb',
  },
  appInfoSection: {
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  errorText: {
    fontSize: 18,
    color: '#dc3545',
    textAlign: 'center',
    marginTop: 50,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    margin: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
    maxWidth: 400,
    minWidth: 300,
  },
  modalIconContainer: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 25,
  },
  modalButton: {
    backgroundColor: '#567396',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    minWidth: 200,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  passwordInput: {
    width: '100%',
    height: 45,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginVertical: 15,
    backgroundColor: '#fff',
    color: '#333',
    fontSize: 16,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    flex: 1,
    marginRight: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  deleteModalButton: {
    backgroundColor: '#dc3545',
    flex: 1,
    marginLeft: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  deleteModalButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default UserProfile;
