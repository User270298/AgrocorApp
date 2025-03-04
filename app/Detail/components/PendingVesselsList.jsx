import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PendingVesselsList = ({ vessels = [], onVesselUpdated, serverUrl }) => {
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});
  const [expandedItems, setExpandedItems] = useState({});

  const handleApproveItem = async (itemId, itemType) => {
    setLoading(prev => ({ ...prev, [itemId]: 'approve' }));
    setErrors(prev => ({ ...prev, [itemId]: null }));
    
    try {
      console.log(`Одобрение записи с ID: ${itemId}, тип: ${itemType}`);
      const endpoint = itemType === 'vessel' 
        ? `${serverUrl}/approve_vessel/${itemId}`
        : `${serverUrl}/approve_cargo/${itemId}`;
        
      const response = await axios.post(
        endpoint,
        {},
        { timeout: 10000 }
      );
      
      console.log('Ответ сервера:', response.data);
      
      if (response.data) {
        console.log(`Запись с ID ${itemId} успешно одобрена`);
        // Вызываем колбэк для обновления списка
        if (onVesselUpdated) {
          onVesselUpdated();
        }
      } else {
        throw new Error(response.data?.message || 'Неизвестная ошибка при одобрении записи');
      }
    } catch (error) {
      console.error(`Ошибка при одобрении записи ${itemId}:`, error);
      
      let errorMessage = 'Ошибка при одобрении записи';
      if (error.response) {
        errorMessage += `: ${error.response.status} - ${error.response.data?.detail || 'Неизвестная ошибка'}`;
      } else if (error.request) {
        errorMessage += ': Нет ответа от сервера';
      } else {
        errorMessage += `: ${error.message}`;
      }
      
      setErrors(prev => ({ ...prev, [itemId]: errorMessage }));
    } finally {
      setLoading(prev => ({ ...prev, [itemId]: null }));
    }
  };

  const handleRejectItem = async (itemId, itemType) => {
    setLoading(prev => ({ ...prev, [itemId]: 'reject' }));
    setErrors(prev => ({ ...prev, [itemId]: null }));
    
    try {
      console.log(`Отклонение записи с ID: ${itemId}, тип: ${itemType}`);
      const endpoint = itemType === 'vessel' 
        ? `${serverUrl}/reject_vessel/${itemId}`
        : `${serverUrl}/reject_cargo/${itemId}`;
        
      const response = await axios.post(
        endpoint,
        {},
        { timeout: 10000 }
      );
      
      console.log('Ответ сервера:', response.data);
      
      if (response.data) {
        console.log(`Запись с ID ${itemId} успешно отклонена`);
        // Вызываем колбэк для обновления списка
        if (onVesselUpdated) {
          onVesselUpdated();
        }
      } else {
        throw new Error(response.data?.message || 'Неизвестная ошибка при отклонении записи');
      }
    } catch (error) {
      console.error(`Ошибка при отклонении записи ${itemId}:`, error);
      
      let errorMessage = 'Ошибка при отклонении записи';
      if (error.response) {
        errorMessage += `: ${error.response.status} - ${error.response.data?.detail || 'Неизвестная ошибка'}`;
      } else if (error.request) {
        errorMessage += ': Нет ответа от сервера';
      } else {
        errorMessage += `: ${error.message}`;
      }
      
      setErrors(prev => ({ ...prev, [itemId]: errorMessage }));
    } finally {
      setLoading(prev => ({ ...prev, [itemId]: null }));
    }
  };

  const toggleItemExpanded = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Если нет записей, показываем сообщение
  if (!vessels || vessels.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="information-circle" size={48} color="#0066cc" />
        <Text style={styles.emptyText}>Нет записей, ожидающих подтверждения</Text>
      </View>
    );
  }

  const renderVesselDetails = (item) => {
    if (item.itemType === 'vessel') {
      return (
        <>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>DWT:</Text>
            <Text style={styles.detailValue}>{item.dwt}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>BLT:</Text>
            <Text style={styles.detailValue}>{item.blt}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Флаг:</Text>
            <Text style={styles.detailValue}>{item.flag}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Открыто в:</Text>
            <Text style={styles.detailValue}>{item.open_at}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Доступность:</Text>
            <Text style={styles.detailValue}>{item.availability}</Text>
          </View>
        </>
      );
    } else if (item.itemType === 'cargo') {
      return (
        <>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Дата:</Text>
            <Text style={styles.detailValue}>{item.date_at}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Груз:</Text>
            <Text style={styles.detailValue}>{item.cargo}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Количество:</Text>
            <Text style={styles.detailValue}>{item.quantity}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Порт загрузки:</Text>
            <Text style={styles.detailValue}>{item.port_loading}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Порт разгрузки:</Text>
            <Text style={styles.detailValue}>{item.port_discharge}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Ставки:</Text>
            <Text style={styles.detailValue}>{item.rates}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Лейкан:</Text>
            <Text style={styles.detailValue}>{item.laycan}</Text>
          </View>
        </>
      );
    }
    
    return null;
  };

  return (
    <ScrollView style={styles.container}>
      {vessels.map((item) => {
        const itemId = item.id;
        const itemType = item.itemType || 'vessel'; // По умолчанию считаем, что это судно
        const isLoading = loading[itemId];
        const error = errors[itemId];
        const isExpanded = expandedItems[itemId];
        
        // Формируем полный URL для изображения
        const imageUrl = item.image_url 
          ? `${serverUrl}/${item.image_url}` 
          : null;
        
        return (
          <View key={itemId} style={styles.vesselItem}>
            <TouchableOpacity 
              style={styles.vesselHeader}
              onPress={() => toggleItemExpanded(itemId)}
            >
              <View style={styles.vesselHeaderContent}>
                <Text style={styles.vesselName}>
                  {itemType === 'vessel' 
                    ? `Судно #${itemId}` 
                    : `Груз #${itemId}`}
                </Text>
                <Text style={styles.vesselType}>
                  {itemType === 'vessel' ? 'Судно' : 'Груз'}
                </Text>
              </View>
              <Ionicons 
                name={isExpanded ? 'chevron-up' : 'chevron-down'} 
                size={24} 
                color="#666" 
              />
            </TouchableOpacity>
            
            {isExpanded && (
              <View style={styles.vesselDetails}>
                {renderVesselDetails(item)}
              </View>
            )}
            
            {imageUrl && isExpanded && (
              <View style={styles.imageContainer}>
                <Image 
                  source={{ uri: imageUrl }} 
                  style={styles.vesselImage}
                  resizeMode="cover"
                />
              </View>
            )}
            
            {error && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color="#ff4d4f" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
            
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={[
                  styles.actionButton, 
                  styles.approveButton,
                  isLoading && styles.disabledButton
                ]}
                onPress={() => handleApproveItem(itemId, itemType)}
                disabled={!!isLoading}
              >
                {isLoading === 'approve' ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={18} color="#fff" />
                    <Text style={styles.actionButtonText}>Одобрить</Text>
                  </>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.actionButton, 
                  styles.rejectButton,
                  isLoading && styles.disabledButton
                ]}
                onPress={() => handleRejectItem(itemId, itemType)}
                disabled={!!isLoading}
              >
                {isLoading === 'reject' ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Ionicons name="close-circle" size={18} color="#fff" />
                    <Text style={styles.actionButtonText}>Отклонить</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginVertical: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  vesselItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  vesselHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  vesselHeaderContent: {
    flex: 1,
  },
  vesselName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  vesselType: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  vesselDetails: {
    marginBottom: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    width: 120,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  detailItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  detailKey: {
    fontWeight: '500',
    color: '#666',
  },
  imageContainer: {
    marginBottom: 16,
  },
  vesselImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff2f0',
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#ff4d4f',
    marginLeft: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
    flex: 1,
    marginHorizontal: 4,
  },
  approveButton: {
    backgroundColor: '#52c41a',
  },
  rejectButton: {
    backgroundColor: '#ff4d4f',
  },
  disabledButton: {
    opacity: 0.6,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 6,
  },
});

export default PendingVesselsList; 