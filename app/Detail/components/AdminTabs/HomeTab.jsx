import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HomeTab = ({ onActionPress }) => {
  const actions = [
    { title: "Добавить новость", action: "news", icon: "newspaper-outline" },
    { title: "Добавить предложение", action: "best", icon: "pricetag-outline" },
    { title: "Добавить анализ", action: "analysis", icon: "analytics-outline" }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Главная страница</Text>
      <View style={styles.buttonGroup}>
        {actions.map((item) => (
          <TouchableOpacity
            key={item.action}
            style={styles.button}
            onPress={() => onActionPress(item.action)}
          >
            <Ionicons name={item.icon} size={24} color="#fff" />
            <Text style={styles.buttonText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  buttonGroup: {
    gap: 12,
  },
  button: {
    backgroundColor: "#007bff",
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
  },
});

export default HomeTab; 