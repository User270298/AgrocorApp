import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { normalizeImageUrl } from '../utils/imageUtils';
import { IMAGE_CATEGORIES } from '../config';

/**
 * Компонент для отображения изображения с правильной обработкой путей
 * 
 * @param {Object} props - Свойства компонента
 * @param {string} props.imageUrl - Путь к изображению
 * @param {string} props.category - Категория изображения (news_image, vessel_image, analysis_image, proposal_image)
 * @param {Object} props.style - Стили для изображения
 * @param {Object} props.containerStyle - Стили для контейнера изображения
 * @param {boolean} props.resizeMode - Режим изменения размера изображения
 * @returns {JSX.Element} - Компонент изображения
 */
const ImageComponent = ({ 
  imageUrl, 
  category = IMAGE_CATEGORIES.DEFAULT, 
  style, 
  containerStyle,
  resizeMode = 'cover'
}) => {
  // Нормализуем путь к изображению
  const normalizedImageUrl = normalizeImageUrl(imageUrl, category);
  
  // Если путь не указан, возвращаем пустой контейнер
  if (!normalizedImageUrl) {
    return <View style={[styles.container, containerStyle]} />;
  }
  
  return (
    <View style={[styles.container, containerStyle]}>
      <Image
        source={{ uri: normalizedImageUrl }}
        style={[styles.image, style]}
        resizeMode={resizeMode}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default ImageComponent; 