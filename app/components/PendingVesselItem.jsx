import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { URL_BASE, VESSEL_STATUSES, API_ENDPOINTS } from '../config';
import ImageComponent from './ImageComponent';

/**
 * Компонент для отображения записи о судне или грузе, ожидающей подтверждения
 * 
 * @param {Object} props - Свойства компонента
 * @param {Object} props.item - Данные о судне или грузе
 * @param {Function} props.onStatusChange - Функция, вызываемая при изменении статуса
 * @returns {JSX.Element} - Компонент записи о судне или грузе
 */
const PendingVesselItem = ({ item, onStatusChange }) => {
  const [loading, setLoading] = useState(false);
  
  // Определяем, является ли запись судном или грузом
  const isVessel = item.dwt !== undefined;
  
  // Обработчик подтверждения записи
  const handleApprove = async () => {
    try {
      setLoading(true);
      
      // Определяем эндпоинт в зависимости от типа записи
      const endpoint = isVessel 
        ? `${API_ENDPOINTS.APPROVE_VESSEL}/${item.id}`
        : `${API_ENDPOINTS.APPROVE_CARGO}/${item.id}`;
      
      // Отправляем запрос на подтверждение
      const response = await axios.post(`${URL_BASE}${endpoint}`);
      
      // Если запрос успешен, вызываем функцию обратного вызова
      if (response.status === 200) {
        console.log('Запись успешно подтверждена:', response.data);
        
        // Вызываем функцию обратного вызова с обновленными данными
        if (onStatusChange) {
          onStatusChange({
            ...item,
            status: VESSEL_STATUSES.APPROVED
          });
        }
      }
    } catch (error) {
      console.error('Ошибка при подтверждении записи:', error);
      Alert.alert('Ошибка', 'Не удалось подтвердить запись');
    } finally {
      setLoading(false);
    }
  };
  
  // Обработчик отклонения записи
  const handleReject = async () => {
    try {
      setLoading(true);
      
      // Определяем эндпоинт в зависимости от типа записи
      const endpoint = isVessel 
        ? `${API_ENDPOINTS.REJECT_VESSEL}/${item.id}`
        : `${API_ENDPOINTS.REJECT_CARGO}/${item.id}`;
      
      // Отправляем запрос на отклонение
      const response = await axios.post(`${URL_BASE}${endpoint}`);
      
      // Если запрос успешен, вызываем функцию обратного вызова
      if (response.status === 200) {
        console.log('Запись успешно отклонена:', response.data);
        
        // Вызываем функцию обратного вызова с обновленными данными
        if (onStatusChange) {
          onStatusChange({
            ...item,
            status: VESSEL_STATUSES.REJECTED
          });
        }
      }
    } catch (error) {
      console.error('Ошибка при отклонении записи:', error);
      Alert.alert('Ошибка', 'Не удалось отклонить запись');
    } finally {
      setLoading(false);
    }
  };
  
  // Рендерим информацию о судне
  const renderVesselInfo = () => (
    <View style={styles.infoContainer}>
      <Text style={styles.title}>Судно</Text>
      <Text style={styles.infoText}>DWT: {item.dwt}</Text>
      <Text style={styles.infoText}>BLT: {item.blt}</Text>
      <Text style={styles.infoText}>Флаг: {item.flag}</Text>
      <Text style={styles.infoText}>Открыто в: {item.open_at}</Text>
      <Text style={styles.infoText}>Доступность: {item.availability}</Text>
    </View>
  );
  
  // Рендерим информацию о грузе
  const renderCargoInfo = () => (
    <View style={styles.infoContainer}>
      <Text style={styles.title}>Груз</Text>
      <Text style={styles.infoText}>Дата: {item.date_at}</Text>
      <Text style={styles.infoText}>Груз: {item.cargo}</Text>
      <Text style={styles.infoText}>Количество: {item.quantity}</Text>
      <Text style={styles.infoText}>Порт погрузки: {item.port_loading}</Text>
      <Text style={styles.infoText}>Порт выгрузки: {item.port_discharge}</Text>
      <Text style={styles.infoText}>Ставки: {item.rates}</Text>
      <Text style={styles.infoText}>Лейкан: {item.laycan}</Text>
    </View>
  );
  
  return (
    <View style={styles.container}>
      {/* Информация о записи */}
      {isVessel ? renderVesselInfo() : renderCargoInfo()}
      
      {/* Кнопки действий */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.approveButton]}
          onPress={handleApprove}
          disabled={loading}
        >
          <Ionicons name="checkmark-circle" size={24} color="white" />
          <Text style={styles.actionButtonText}>Подтвердить</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.rejectButton]}
          onPress={handleReject}
          disabled={loading}
        >
          <Ionicons name="close-circle" size={24} color="white" />
          <Text style={styles.actionButtonText}>Отклонить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoContainer: {
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default PendingVesselItem; 