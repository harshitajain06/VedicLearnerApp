import React from 'react';
import { Alert } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import HomePage from './HomePage';
import LessonsPage from './LessonsPage';
import TrackPage from './TrackPage';
import PracticePage from './PracticePage';
import AddPractice from './AddPractice'; // Import AddPractice screen
import SubPractice from './SubPractice'; // Import SubPractice screen
import MulPractice from './MulPractice'; // Import MulPractice screen
import DivPractice from './DivPractice'; // Import DivPractice screen
import RegisterScreen from './Register';
import Login from './Login';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons'; // If using Expo
import { signOut } from 'firebase/auth'; // Ensure Firebase auth is configured
import { auth } from '../../config/firebase'; // Adjust the path to your Firebase config file
import LessonDetail from './LessonDetail'
import UserProfile from './UserProfile'

// Import your modules screens
import Addition from './Addition';
import Subtraction from './Subtraction';
import Multiplication from './Multiplication';
import Division from './Division';
import AdvancedOperations from './AdvancedOperations';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Practice Stack Navigator
const PracticeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Show headers for nested screens
      }}
    >
      <Stack.Screen name="PracticePage" component={PracticePage} options={{ title: 'Practice' }} />
      <Stack.Screen name="AddPractice" component={AddPractice} options={{ title: 'Addition Practice' }} />
      <Stack.Screen name="SubPractice" component={SubPractice} options={{ title: 'Subtraction Practice' }} />
      <Stack.Screen name="MulPractice" component={MulPractice} options={{ title: 'Multiplication Practice' }} />
      <Stack.Screen name="DivPractice" component={DivPractice} options={{ title: 'Division Practice' }} />
    </Stack.Navigator>
  );
};

const ModulesStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Show headers for nested screens
      }}
    >
      <Stack.Screen name="LessonsPage" component={LessonsPage} options={{ title: 'Lessons' }} />
      <Stack.Screen name="Addition" component={Addition} />
      <Stack.Screen name="LessonDetail" component={LessonDetail} />
      <Stack.Screen name="Subtraction" component={Subtraction} />
      <Stack.Screen name="Multiplication" component={Multiplication} />
      <Stack.Screen name="Division" component={Division} />
      <Stack.Screen name="Advanced Operations" component={AdvancedOperations} />
    </Stack.Navigator>
  );
};

// Bottom Tab Navigator Component
const BottomTabs = () => {
  const colorScheme = useColorScheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Lessons') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Track') {
            iconName = focused ? 'trending-up' : 'trending-up-outline';
          } else if (route.name === 'Practice') {
            iconName = focused ? 'school' : 'school-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="Lessons" component={ModulesStack} />
      {/* <Tab.Screen name="Track" component={TrackPage} /> */}
      <Tab.Screen name="Practice" component={PracticeStack} />
    </Tab.Navigator>
  );
};

// Drawer Navigator Component
const DrawerNavigator = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            signOut(auth)
              .then(() => {
                navigation.replace('Login'); // Navigate to Login screen
              })
              .catch((err) => {
                console.error('Logout Error:', err);
                Alert.alert('Error', 'Failed to logout. Please try again.');
              });
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <Drawer.Navigator initialRouteName="MainTabs">
      <Drawer.Screen name="MainTabs" component={BottomTabs} options={{ title: 'Home' }} />
      
      {/* User Profile */}
      <Drawer.Screen 
        name="UserProfile" 
        component={UserProfile} 
        options={{
          title: 'Account Settings',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Logout option */}
      <Drawer.Screen
        name="Logout"
        component={BottomTabs}
        options={{
          title: 'Logout',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="log-out-outline" size={size} color={color} />
          ),
        }}
        listeners={{
          drawerItemPress: (e) => {
            e.preventDefault();
            handleLogout();
          },
        }}
      />
    </Drawer.Navigator>
  );
};

// Stack Navigator Component
export default function StackLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors[colorScheme ?? 'light'].background },
      }}
    >
      {/* Authentication Screens */}
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={RegisterScreen} />

      {/* Main App with Drawer */}
      <Stack.Screen name="Drawer" component={DrawerNavigator} />

      {/* Modules screens */}
    </Stack.Navigator>
  );
}
