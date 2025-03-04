import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { SERVER_URL } from '../../../config';

const VesselCatcherTab = ({ onActionPress }) => {
  const [loading, setLoading] = useState(false);
  const [pendingItems, setPendingItems] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    fetchPendingItems();
  }, []);

  const fetchPendingItems = async () => {
    setLoading(true);
    try {
      const [vesselsResponse, cargoResponse] = await Promise.all([
        axios.get(`${SERVER_URL}/pending_vessels`),
        axios.get(`${SERVER_URL}/pending_cargo`)
      ]);

      const allItems = [
        ...vesselsResponse.data.map(item => ({ ...item, type: 'vessel' })),
        ...cargoResponse.data.map(item => ({ ...item, type: 'cargo' }))
      ];

      setPendingItems(allItems);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить список заявок');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, type, action) => {
    try {
      const endpoint = `${SERVER_URL}/${action}_${type}/${id}`;
      await axios.post(endpoint);
      
      Alert.alert(
        'Успешно',
        `Заявка успешно ${action === 'approve' ? 'одобрена' : 'отклонена'}`
      );
      
      fetchPendingItems();
    } catch (error) {
      console.error('Ошибка при обработке заявки:', error);
      Alert.alert('Ошибка', 'Не удалось обработать заявку');
    }
  };

  const toggleExpanded = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const renderItemDetails = (item) => {
    if (item.type === 'vessel') {
      return (
        <>
          <DetailRow label="DWT" value={item.dwt} />
          <DetailRow label="BLT" value={item.blt} />
          <DetailRow label="Флаг" value={item.flag} />
          <DetailRow label="Открыто в" value={item.open_at} />
          <DetailRow label="Доступность" value={item.availability} />
        </>
      );
    } else {
      return (
        <>
          <DetailRow label="Дата" value={item.date_at} />
          <DetailRow label="Груз" value={item.cargo} />
          <DetailRow label="Количество" value={item.quantity} />
          <DetailRow label="Порт загрузки" value={item.port_loading} />
          <DetailRow label="Порт разгрузки" value={item.port_discharge} />
          <DetailRow label="Ставки" value={item.rates} />
          <DetailRow label="Лейкан" value={item.laycan} />
        </>
      );
    }
  };

  const DetailRow = ({ label, value }) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Загрузка заявок...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Vessel Catcher</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => onActionPress('catcher')}
        >
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Добавить новость</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.itemsList}>
        {pendingItems.length === 0 ? (
          <Text style={styles.emptyText}>Нет заявок на рассмотрении</Text>
        ) : (
          pendingItems.map((item) => (
            <View key={`${item.type}-${item.id}`} style={styles.itemCard}>
              <TouchableOpacity
                style={styles.itemHeader}
                onPress={() => toggleExpanded(item.id)}
              >
                <View style={styles.itemTitleContainer}>
                  <Ionicons
                    name={item.type === 'vessel' ? 'boat-outline' : 'cube-outline'}
                    size={24}
                    color="#007bff"
                  />
                  <Text style={styles.itemTitle}>
                    {item.type === 'vessel' ? 'Судно' : 'Груз'} #{item.id}
                  </Text>
                </View>
                <Ionicons
                  name={expandedItems[item.id] ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>

              {expandedItems[item.id] && (
                <>
                  <View style={styles.itemDetails}>
                    {renderItemDetails(item)}
                  </View>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.approveButton]}
                      onPress={() => handleAction(item.id, item.type, 'approve')}
                    >
                      <Ionicons name="checkmark-circle" size={20} color="#fff" />
                      <Text style={styles.actionButtonText}>Одобрить</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.rejectButton]}
                      onPress={() => handleAction(item.id, item.type, 'reject')}
                    >
                      <Ionicons name="close-circle" size={20} color="#fff" />
                      <Text style={styles.actionButtonText}>Отклонить</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  itemsList: {
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 20,
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
    overflow: 'hidden',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  itemTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  itemDetails: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    width: 120,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  approveButton: {
    backgroundColor: '#28a745',
  },
  rejectButton: {
    backgroundColor: '#dc3545',
  },
  actionButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '500',
  },
});

export default VesselCatcherTab; 