import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VESSEL_STATUSES } from '../config';
import StatusBadge from './StatusBadge';
import ImageComponent from './ImageComponent';

/**
 * Компонент для отображения деталей записи Vessel Catcher
 * 
 * @param {Object} props - Свойства компонента
 * @param {Object} props.item - Данные о судне или грузе
 * @param {Function} props.onPress - Функция, вызываемая при нажатии на карточку
 * @returns {JSX.Element} - Компонент карточки с деталями
 */
const VesselDetailCard = ({ item, onPress }) => {
  // Определяем, является ли запись судном или грузом
  const isVessel = item.dwt !== undefined;
  
  // Определяем иконку в зависимости от типа записи
  const iconName = isVessel ? 'boat-outline' : 'cube-outline';
  
  // Рендерим информацию о судне
  const renderVesselInfo = () => (
    <View style={styles.infoContainer}>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>DWT:</Text>
        <Text style={styles.infoValue}>{item.dwt}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>BLT:</Text>
        <Text style={styles.infoValue}>{item.blt}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Флаг:</Text>
        <Text style={styles.infoValue}>{item.flag}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Открыто в:</Text>
        <Text style={styles.infoValue}>{item.open_at}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Доступность:</Text>
        <Text style={styles.infoValue}>{item.availability}</Text>
      </View>
    </View>
  );
  
  // Рендерим информацию о грузе
  const renderCargoInfo = () => (
    <View style={styles.infoContainer}>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Дата:</Text>
        <Text style={styles.infoValue}>{item.date_at}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Груз:</Text>
        <Text style={styles.infoValue}>{item.cargo}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Количество:</Text>
        <Text style={styles.infoValue}>{item.quantity}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Порт погрузки:</Text>
        <Text style={styles.infoValue}>{item.port_loading}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Порт выгрузки:</Text>
        <Text style={styles.infoValue}>{item.port_discharge}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Ставки:</Text>
        <Text style={styles.infoValue}>{item.rates}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Лейкан:</Text>
        <Text style={styles.infoValue}>{item.laycan}</Text>
      </View>
    </View>
  );
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress && onPress(item)}
      activeOpacity={0.7}
    >
      {/* Заголовок карточки */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name={iconName} size={24} color="#0066CC" style={styles.icon} />
          <Text style={styles.title}>
            {isVessel ? `Судно ${item.dwt}` : `Груз ${item.cargo}`}
          </Text>
        </View>
        <StatusBadge status={item.status || VESSEL_STATUSES.PENDING} />
      </View>
      
      {/* Изображение, если есть */}
      {item.image_url && (
        <View style={styles.imageContainer}>
          <ImageComponent 
            imageUrl={item.image_url} 
            category={isVessel ? 'vessel_image' : 'cargo_image'} 
            style={styles.image}
          />
        </View>
      )}
      
      {/* Информация о записи */}
      {isVessel ? renderVesselInfo() : renderCargoInfo()}
      
      {/* Дата создания */}
      <View style={styles.footer}>
        <Text style={styles.dateText}>
          Создано: {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  imageContainer: {
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
    height: 150,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    width: 120,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 10,
  },
  dateText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
});

export default VesselDetailCard; 