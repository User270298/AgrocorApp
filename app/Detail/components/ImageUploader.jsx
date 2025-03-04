import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Platform,
  Dimensions
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ImageUploader = ({ onImageUploaded, category, serverUrl }) => {
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const pickImage = async () => {
    try {
      console.log('Запуск выбора изображения...');
      // Запрашиваем разрешения, если они еще не были предоставлены
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          console.error('Разрешение на доступ к медиатеке не предоставлено');
          setUploadError('Нет разрешения на доступ к галерее');
          return;
        }
      }

      // Открываем галерею для выбора изображения
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      console.log('Результат выбора изображения:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        setPreviewImage(selectedAsset.uri);
        
        // Автоматически загружаем выбранное изображение
        await uploadImage(selectedAsset);
      }
    } catch (error) {
      console.error('Ошибка при выборе изображения:', error);
      setUploadError('Ошибка при выборе изображения');
    }
  };

  const uploadImage = async (imageAsset) => {
    if (!imageAsset || !imageAsset.uri) {
      console.error('Нет изображения для загрузки');
      return;
    }

    setLoading(true);
    setUploadError(null);

    try {
      console.log(`Загрузка изображения на сервер: ${serverUrl}/api/upload_image`);
      
      // Проверяем доступность сервера перед загрузкой
      try {
        const healthCheck = await axios.get(`${serverUrl}/api/health`, { timeout: 5000 });
        console.log('Статус сервера:', healthCheck.data);
      } catch (healthError) {
        console.warn('Не удалось проверить статус сервера:', healthError);
      }

      // Создаем FormData для отправки файла
      const formData = new FormData();
      
      // Получаем имя файла из URI
      const uriParts = imageAsset.uri.split('/');
      const fileName = uriParts[uriParts.length - 1];
      
      // Определяем тип файла
      const fileType = fileName.split('.').pop();
      const mimeType = fileType === 'jpg' || fileType === 'jpeg' 
        ? 'image/jpeg' 
        : fileType === 'png' ? 'image/png' : 'image/jpg';
      
      // Добавляем файл в formData
      formData.append('file', {
        uri: imageAsset.uri,
        name: fileName,
        type: mimeType,
      });
      
      // Добавляем категорию
      formData.append('category', category || 'image');
      
      // Отправляем запрос с увеличенным таймаутом
      const response = await axios.post(
        `${serverUrl}/api/upload_image`, 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 15000, // 15 секунд таймаут
        }
      );
      
      console.log('Ответ сервера:', response.data);
      
      if (response.data && response.data.file_path) {
        // Успешная загрузка
        const imagePath = response.data.file_path;
        console.log('Изображение успешно загружено:', imagePath);
        
        // Вызываем колбэк с путем к изображению
        onImageUploaded(imagePath);
      } else {
        console.error('Неверный формат ответа от сервера:', response.data);
        setUploadError('Ошибка при загрузке изображения: неверный формат ответа');
      }
    } catch (error) {
      console.error('Ошибка при загрузке изображения:', error);
      
      let errorMessage = 'Ошибка при загрузке изображения';
      
      if (error.response) {
        // Ошибка от сервера
        errorMessage += `: ${error.response.status} - ${error.response.data?.detail || 'Неизвестная ошибка'}`;
        console.error('Ответ сервера с ошибкой:', error.response.data);
      } else if (error.request) {
        // Нет ответа от сервера
        errorMessage += ': Нет ответа от сервера';
      } else {
        // Ошибка при настройке запроса
        errorMessage += `: ${error.message}`;
      }
      
      setUploadError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {uploadError && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={20} color="#ff4d4f" />
          <Text style={styles.errorText}>{uploadError}</Text>
        </View>
      )}
      
      <TouchableOpacity 
        style={styles.uploadButton} 
        onPress={pickImage}
        disabled={loading}
      >
        <Ionicons name="cloud-upload" size={24} color="#fff" />
        <Text style={styles.uploadButtonText}>
          {loading ? 'Загрузка...' : 'Выбрать изображение'}
        </Text>
      </TouchableOpacity>
      
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Загрузка изображения...</Text>
        </View>
      )}
      
      {previewImage && !loading && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: previewImage }} style={styles.previewImage} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 10,
    alignItems: 'center',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    width: SCREEN_WIDTH * 0.8,
    maxWidth: 300,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 15,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  previewContainer: {
    marginTop: 15,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  previewImage: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_WIDTH * 0.6,
    maxWidth: 300,
    maxHeight: 225,
    resizeMode: 'cover',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff2f0',
    borderWidth: 1,
    borderColor: '#ffccc7',
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
    width: SCREEN_WIDTH * 0.8,
    maxWidth: 300,
  },
  errorText: {
    color: '#ff4d4f',
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
});

export default ImageUploader; 