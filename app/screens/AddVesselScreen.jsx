import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { URL_BASE, API_ENDPOINTS } from '../config';

/**
 * Экран для добавления новой записи Vessel Catcher
 * 
 * @param {Object} props - Свойства компонента
 * @param {Object} props.navigation - Объект навигации
 * @param {Object} props.route - Объект маршрута
 * @returns {JSX.Element} - Компонент экрана добавления записи
 */
const AddVesselScreen = ({ navigation, route }) => {
  // Получаем тип записи из параметров маршрута
  const { type = 'vessel' } = route.params || {};
  
  // Состояние для хранения данных формы
  const [formData, setFormData] = useState(
    type === 'vessel' 
      ? {
          dwt: '',
          blt: '',
          flag: '',
          open_at: '',
          availability: '',
          image_url: null
        }
      : {
          date_at: '',
          cargo: '',
          quantity: '',
          port_loading: '',
          port_discharge: '',
          rates: '',
          laycan: '',
          image_url: null
        }
  );
  
  // Состояние для отслеживания загрузки
  const [loading, setLoading] = useState(false);
  
  // Состояние для хранения выбранного изображения
  const [selectedImage, setSelectedImage] = useState(null);
  
  // Запрашиваем разрешения на доступ к галерее при монтировании компонента
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Требуется разрешение',
          'Для загрузки изображений необходим доступ к галерее'
        );
      }
    })();
  }, []);
  
  // Обработчик изменения значений полей формы
  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  // Обработчик выбора изображения из галереи
  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Ошибка при выборе изображения:', error);
      Alert.alert('Ошибка', 'Не удалось выбрать изображение');
    }
  };
  
  // Функция для загрузки изображения на сервер
  const uploadImage = async () => {
    if (!selectedImage) return null;
    
    try {
      // Создаем объект FormData для отправки файла
      const formDataObj = new FormData();
      
      // Получаем имя файла из URI
      const fileName = selectedImage.split('/').pop();
      
      // Определяем тип файла
      const match = /\.(\w+)$/.exec(fileName);
      const type = match ? `image/${match[1]}` : 'image';
      
      // Определяем категорию изображения
      const category = type === 'vessel' ? 'vessel_image' : 'cargo_image';
      
      // Добавляем файл в FormData
      formDataObj.append('file', {
        uri: selectedImage,
        name: fileName,
        type,
      });
      
      // Добавляем категорию в FormData
      formDataObj.append('category', category);
      
      // Отправляем запрос на загрузку изображения
      const response = await axios.post(
        `${URL_BASE}${API_ENDPOINTS.UPLOAD_IMAGE}`,
        formDataObj,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      // Возвращаем путь к загруженному изображению
      return response.data.file_path;
    } catch (error) {
      console.error('Ошибка при загрузке изображения:', error);
      throw new Error('Не удалось загрузить изображение');
    }
  };
  
  // Обработчик отправки формы
  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Проверяем заполнение обязательных полей
      const requiredFields = type === 'vessel' 
        ? ['dwt', 'blt', 'flag', 'open_at'] 
        : ['date_at', 'cargo', 'quantity', 'port_loading', 'port_discharge'];
      
      const emptyFields = requiredFields.filter(field => !formData[field]);
      
      if (emptyFields.length > 0) {
        Alert.alert(
          'Ошибка валидации',
          'Пожалуйста, заполните все обязательные поля'
        );
        setLoading(false);
        return;
      }
      
      // Загружаем изображение, если оно выбрано
      let imagePath = null;
      if (selectedImage) {
        imagePath = await uploadImage();
      }
      
      // Создаем объект с данными для отправки
      const dataToSend = {
        ...formData,
        image_url: imagePath
      };
      
      // Определяем эндпоинт в зависимости от типа записи
      const endpoint = type === 'vessel' 
        ? API_ENDPOINTS.CREATE_VESSEL 
        : API_ENDPOINTS.CREATE_CARGO;
      
      // Отправляем запрос на создание записи
      const response = await axios.post(`${URL_BASE}${endpoint}`, dataToSend);
      
      // Если запрос успешен, показываем сообщение и возвращаемся на предыдущий экран
      if (response.status === 200 || response.status === 201) {
        Alert.alert(
          'Успех',
          `${type === 'vessel' ? 'Судно' : 'Груз'} успешно добавлен`,
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      }
    } catch (error) {
      console.error('Ошибка при отправке формы:', error);
      Alert.alert(
        'Ошибка',
        `Не удалось добавить ${type === 'vessel' ? 'судно' : 'груз'}`
      );
    } finally {
      setLoading(false);
    }
  };
  
  // Рендерим форму для судна
  const renderVesselForm = () => (
    <>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>DWT *</Text>
        <TextInput
          style={styles.input}
          value={formData.dwt}
          onChangeText={(text) => handleInputChange('dwt', text)}
          placeholder="Введите DWT"
          keyboardType="numeric"
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>BLT *</Text>
        <TextInput
          style={styles.input}
          value={formData.blt}
          onChangeText={(text) => handleInputChange('blt', text)}
          placeholder="Введите BLT"
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Флаг *</Text>
        <TextInput
          style={styles.input}
          value={formData.flag}
          onChangeText={(text) => handleInputChange('flag', text)}
          placeholder="Введите флаг"
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Открыто в *</Text>
        <TextInput
          style={styles.input}
          value={formData.open_at}
          onChangeText={(text) => handleInputChange('open_at', text)}
          placeholder="Введите место открытия"
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Доступность</Text>
        <TextInput
          style={styles.input}
          value={formData.availability}
          onChangeText={(text) => handleInputChange('availability', text)}
          placeholder="Введите доступность"
        />
      </View>
    </>
  );
  
  // Рендерим форму для груза
  const renderCargoForm = () => (
    <>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Дата *</Text>
        <TextInput
          style={styles.input}
          value={formData.date_at}
          onChangeText={(text) => handleInputChange('date_at', text)}
          placeholder="Введите дату"
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Груз *</Text>
        <TextInput
          style={styles.input}
          value={formData.cargo}
          onChangeText={(text) => handleInputChange('cargo', text)}
          placeholder="Введите название груза"
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Количество *</Text>
        <TextInput
          style={styles.input}
          value={formData.quantity}
          onChangeText={(text) => handleInputChange('quantity', text)}
          placeholder="Введите количество"
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Порт погрузки *</Text>
        <TextInput
          style={styles.input}
          value={formData.port_loading}
          onChangeText={(text) => handleInputChange('port_loading', text)}
          placeholder="Введите порт погрузки"
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Порт выгрузки *</Text>
        <TextInput
          style={styles.input}
          value={formData.port_discharge}
          onChangeText={(text) => handleInputChange('port_discharge', text)}
          placeholder="Введите порт выгрузки"
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Ставки</Text>
        <TextInput
          style={styles.input}
          value={formData.rates}
          onChangeText={(text) => handleInputChange('rates', text)}
          placeholder="Введите ставки"
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Лейкан</Text>
        <TextInput
          style={styles.input}
          value={formData.laycan}
          onChangeText={(text) => handleInputChange('laycan', text)}
          placeholder="Введите лейкан"
        />
      </View>
    </>
  );
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        {/* Заголовок экрана */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            Добавить {type === 'vessel' ? 'судно' : 'груз'}
          </Text>
        </View>
        
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Форма в зависимости от типа записи */}
          {type === 'vessel' ? renderVesselForm() : renderCargoForm()}
          
          {/* Блок для выбора изображения */}
          <View style={styles.imageSection}>
            <Text style={styles.label}>Изображение</Text>
            
            <TouchableOpacity
              style={styles.imagePickerButton}
              onPress={handlePickImage}
            >
              <Ionicons name="image-outline" size={24} color="#0066CC" />
              <Text style={styles.imagePickerText}>
                {selectedImage ? 'Изменить изображение' : 'Выбрать изображение'}
              </Text>
            </TouchableOpacity>
            
            {selectedImage && (
              <View style={styles.selectedImageContainer}>
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.selectedImage}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => setSelectedImage(null)}
                >
                  <Ionicons name="close-circle" size={24} color="white" />
                </TouchableOpacity>
              </View>
            )}
          </View>
          
          {/* Кнопка отправки формы */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Ionicons name="save-outline" size={20} color="white" />
                <Text style={styles.submitButtonText}>Сохранить</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  imageSection: {
    marginVertical: 20,
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#0066CC',
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  imagePickerText: {
    marginLeft: 10,
    color: '#0066CC',
    fontSize: 16,
  },
  selectedImageContainer: {
    marginTop: 15,
    position: 'relative',
    borderRadius: 5,
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 5,
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
  },
  submitButton: {
    backgroundColor: '#0066CC',
    borderRadius: 5,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default AddVesselScreen; 