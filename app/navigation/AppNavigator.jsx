import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Импортируем экраны
import VesselCatcherScreen from '../screens/VesselCatcherScreen';
import AddVesselScreen from '../screens/AddVesselScreen';
import AdminScreen from '../screens/AdminScreen';

// Создаем стеки навигации
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Стек навигации для Vessel Catcher
const VesselCatcherStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="VesselCatcherMain" component={VesselCatcherScreen} />
    <Stack.Screen name="AddVessel" component={AddVesselScreen} />
  </Stack.Navigator>
);

// Стек навигации для админ-панели
const AdminStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="AdminMain" component={AdminScreen} />
  </Stack.Navigator>
);

// Основная навигация с вкладками
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'VesselCatcher') {
              iconName = focused ? 'boat' : 'boat-outline';
            } else if (route.name === 'Admin') {
              iconName = focused ? 'shield' : 'shield-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#0066CC',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen 
          name="VesselCatcher" 
          component={VesselCatcherStack} 
          options={{ 
            title: 'Vessel Catcher',
          }}
        />
        <Tab.Screen 
          name="Admin" 
          component={AdminStack} 
          options={{ 
            title: 'Администратор',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 