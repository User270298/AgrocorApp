import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import axios from 'axios';
import { URL_BASE, API_ENDPOINTS } from '../config';
import PendingVesselItem from './PendingVesselItem';

/**
 * Компонент для отображения списка записей, ожидающих подтверждения
 * 
 * @param {Object} props - Свойства компонента
 * @param {string} props.type - Тип записей ('vessel' или 'cargo')
 * @returns {JSX.Element} - Компонент списка записей
 */
const PendingVesselsList = ({ type = 'vessel' }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Функция для загрузки данных
  const fetchData = async () => {
    try {
      setError(null);
      
      // Определяем эндпоинт в зависимости от типа записей
      const endpoint = type === 'vessel' 
        ? API_ENDPOINTS.PENDING_VESSELS 
        : API_ENDPOINTS.PENDING_CARGO;
      
      // Отправляем запрос на получение данных
      const response = await axios.get(`${URL_BASE}${endpoint}`);
      
      // Обновляем состояние с полученными данными
      setItems(response.data);
    } catch (error) {
      console.error(`Ошибка при загрузке ${type === 'vessel' ? 'судов' : 'грузов'}:`, error);
      setError(`Не удалось загрузить ${type === 'vessel' ? 'суда' : 'грузы'}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    fetchData();
  }, [type]);

  // Обработчик обновления при pull-to-refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Обработчик изменения статуса записи
  const handleStatusChange = (updatedItem) => {
    // Удаляем запись из списка, так как она больше не ожидает подтверждения
    setItems(items.filter(item => item.id !== updatedItem.id));
  };

  // Рендерим элемент списка
  const renderItem = ({ item }) => (
    <PendingVesselItem 
      item={item} 
      onStatusChange={handleStatusChange} 
    />
  );

  // Рендерим пустой список
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {error || `Нет ${type === 'vessel' ? 'судов' : 'грузов'}, ожидающих подтверждения`}
      </Text>
    </View>
  );

  // Рендерим разделитель между элементами списка
  const renderSeparator = () => <View style={styles.separator} />;

  // Если данные загружаются, показываем индикатор загрузки
  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066CC" />
        <Text style={styles.loadingText}>
          Загрузка {type === 'vessel' ? 'судов' : 'грузов'}...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {type === 'vessel' ? 'Суда' : 'Грузы'}, ожидающие подтверждения
      </Text>
      
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={renderEmptyList}
        ItemSeparatorComponent={renderSeparator}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#0066CC']}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  listContent: {
    padding: 15,
    paddingBottom: 30,
    flexGrow: 1,
  },
  separator: {
    height: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default PendingVesselsList; 