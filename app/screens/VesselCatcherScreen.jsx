import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  RefreshControl, 
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { URL_BASE, API_ENDPOINTS, VESSEL_STATUSES } from '../config';
import VesselDetailCard from '../components/VesselDetailCard';

/**
 * Экран для отображения списка всех записей Vessel Catcher
 * 
 * @param {Object} props - Свойства компонента
 * @param {Object} props.navigation - Объект навигации
 * @returns {JSX.Element} - Компонент экрана Vessel Catcher
 */
const VesselCatcherScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('vessels');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  // Функция для загрузки данных
  const fetchData = async () => {
    try {
      setError(null);
      
      // Определяем эндпоинт в зависимости от типа записей
      const endpoint = activeTab === 'vessels' 
        ? API_ENDPOINTS.VESSELS 
        : API_ENDPOINTS.CARGO;
      
      // Отправляем запрос на получение данных
      const response = await axios.get(`${URL_BASE}${endpoint}`);
      
      // Обновляем состояние с полученными данными
      setItems(response.data);
    } catch (error) {
      console.error(`Ошибка при загрузке ${activeTab === 'vessels' ? 'судов' : 'грузов'}:`, error);
      setError(`Не удалось загрузить ${activeTab === 'vessels' ? 'суда' : 'грузы'}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Загружаем данные при монтировании компонента и при изменении активной вкладки
  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [activeTab]);

  // Обработчик обновления при pull-to-refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Обработчик переключения вкладок
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Обработчик переключения фильтра статуса
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
  };

  // Обработчик нажатия на карточку
  const handleItemPress = (item) => {
    // Здесь можно добавить навигацию на экран деталей
    console.log('Нажатие на элемент:', item);
  };

  // Фильтруем элементы по статусу
  const filteredItems = statusFilter === 'all' 
    ? items 
    : items.filter(item => item.status === statusFilter);

  // Рендерим элемент списка
  const renderItem = ({ item }) => (
    <VesselDetailCard 
      item={item} 
      onPress={handleItemPress} 
    />
  );

  // Рендерим пустой список
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {error || `Нет ${activeTab === 'vessels' ? 'судов' : 'грузов'} для отображения`}
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
          Загрузка {activeTab === 'vessels' ? 'судов' : 'грузов'}...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Заголовок экрана */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Vessel Catcher</Text>
        </View>

        {/* Вкладки для переключения между судами и грузами */}
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

        {/* Фильтры по статусу */}
        <View style={styles.filtersContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              statusFilter === 'all' && styles.activeFilterButton
            ]}
            onPress={() => handleStatusFilterChange('all')}
          >
            <Text
              style={[
                styles.filterButtonText,
                statusFilter === 'all' && styles.activeFilterButtonText
              ]}
            >
              Все
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              statusFilter === VESSEL_STATUSES.PENDING && styles.activeFilterButton
            ]}
            onPress={() => handleStatusFilterChange(VESSEL_STATUSES.PENDING)}
          >
            <Text
              style={[
                styles.filterButtonText,
                statusFilter === VESSEL_STATUSES.PENDING && styles.activeFilterButtonText
              ]}
            >
              Ожидающие
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              statusFilter === VESSEL_STATUSES.APPROVED && styles.activeFilterButton
            ]}
            onPress={() => handleStatusFilterChange(VESSEL_STATUSES.APPROVED)}
          >
            <Text
              style={[
                styles.filterButtonText,
                statusFilter === VESSEL_STATUSES.APPROVED && styles.activeFilterButtonText
              ]}
            >
              Подтвержденные
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              statusFilter === VESSEL_STATUSES.REJECTED && styles.activeFilterButton
            ]}
            onPress={() => handleStatusFilterChange(VESSEL_STATUSES.REJECTED)}
          >
            <Text
              style={[
                styles.filterButtonText,
                statusFilter === VESSEL_STATUSES.REJECTED && styles.activeFilterButtonText
              ]}
            >
              Отклоненные
            </Text>
          </TouchableOpacity>
        </View>

        {/* Список записей */}
        <FlatList
          data={filteredItems}
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

        {/* Кнопка добавления новой записи */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddVessel', { type: activeTab })}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
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
  filtersContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginHorizontal: 4,
    backgroundColor: '#F5F5F5',
  },
  activeFilterButton: {
    backgroundColor: '#0066CC',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#666',
  },
  activeFilterButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  listContent: {
    padding: 15,
    paddingBottom: 80, // Дополнительный отступ для кнопки добавления
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
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0066CC',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default VesselCatcherScreen;