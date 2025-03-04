import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PendingVesselsList from '../components/PendingVesselsList';

/**
 * Экран администратора для управления записями Vessel Catcher
 * 
 * @returns {JSX.Element} - Компонент экрана администратора
 */
const AdminScreen = () => {
  // Состояние для отслеживания активной вкладки
  const [activeTab, setActiveTab] = useState('vessels');

  // Обработчик переключения вкладок
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Заголовок экрана */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Панель администратора</Text>
        </View>

        {/* Вкладки */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'vessels' && styles.activeTabButton
            ]}
            onPress={() => handleTabChange('vessels')}
          >
            <Ionicons
              name="boat-outline"
              size={24}
              color={activeTab === 'vessels' ? '#0066CC' : '#666'}
            />
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'vessels' && styles.activeTabButtonText
              ]}
            >
              Суда
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'cargo' && styles.activeTabButton
            ]}
            onPress={() => handleTabChange('cargo')}
          >
            <Ionicons
              name="cube-outline"
              size={24}
              color={activeTab === 'cargo' ? '#0066CC' : '#666'}
            />
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'cargo' && styles.activeTabButtonText
              ]}
            >
              Грузы
            </Text>
          </TouchableOpacity>
        </View>

        {/* Содержимое вкладки */}
        <View style={styles.content}>
          {activeTab === 'vessels' ? (
            <PendingVesselsList type="vessel" />
          ) : (
            <PendingVesselsList type="cargo" />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#0066CC',
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#0066CC',
  },
  tabButtonText: {
    fontSize: 16,
    marginLeft: 8,
    color: '#666',
  },
  activeTabButtonText: {
    color: '#0066CC',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
});

export default AdminScreen; 