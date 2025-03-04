import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { VESSEL_STATUSES } from '../config';

/**
 * Компонент для отображения статуса записи
 * 
 * @param {Object} props - Свойства компонента
 * @param {string} props.status - Статус записи (PENDING, APPROVED, REJECTED)
 * @param {Object} props.style - Дополнительные стили для компонента
 * @returns {JSX.Element} - Компонент статуса
 */
const StatusBadge = ({ status, style }) => {
  // Определяем стили и текст в зависимости от статуса
  let badgeStyle = styles.pendingBadge;
  let textStyle = styles.pendingText;
  let statusText = 'Ожидает подтверждения';

  switch (status) {
    case VESSEL_STATUSES.APPROVED:
      badgeStyle = styles.approvedBadge;
      textStyle = styles.approvedText;
      statusText = 'Подтверждено';
      break;
    case VESSEL_STATUSES.REJECTED:
      badgeStyle = styles.rejectedBadge;
      textStyle = styles.rejectedText;
      statusText = 'Отклонено';
      break;
    case VESSEL_STATUSES.PENDING:
    default:
      // Используем значения по умолчанию
      break;
  }

  return (
    <View style={[styles.badge, badgeStyle, style]}>
      <Text style={[styles.text, textStyle]}>{statusText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  pendingBadge: {
    backgroundColor: '#FFF9C4',
    borderWidth: 1,
    borderColor: '#FBC02D',
  },
  pendingText: {
    color: '#F57F17',
  },
  approvedBadge: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#66BB6A',
  },
  approvedText: {
    color: '#2E7D32',
  },
  rejectedBadge: {
    backgroundColor: '#FFEBEE',
    borderWidth: 1,
    borderColor: '#EF5350',
  },
  rejectedText: {
    color: '#C62828',
  },
});

export default StatusBadge; 