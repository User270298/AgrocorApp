import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ImageUploader from './ImageUploader';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const FormModal = ({
  visible,
  onClose,
  title,
  fields,
  values = {},
  onChangeField,
  onSubmit,
  loading = false,
  imageCategory,
  serverUrl,
  additionalComponents,
  selectedImage
}) => {
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Инициализация значений формы при открытии модального окна
  useEffect(() => {
    if (visible) {
      setFormValues(values || {});
      setErrors({});
    }
  }, [visible, values]);

  const handleChange = (field, value) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Очищаем ошибку для поля при изменении значения
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Проверяем обязательные поля
    fields.forEach(field => {
      if (field.required && !formValues[field.name]) {
        newErrors[field.name] = `Поле "${field.label}" обязательно для заполнения`;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      console.log('Форма содержит ошибки:', errors);
      return;
    }

    try {
      // Добавляем изображение в данные формы, если оно есть
      const dataToSubmit = {
        ...formValues,
        image_url: formValues.image_url
      };

      console.log('Отправка данных формы:', dataToSubmit);
      await onSubmit(dataToSubmit);
      
      // Сбрасываем форму после успешной отправки
      setFormValues({});
      setErrors({});
    } catch (error) {
      console.error('Ошибка при отправке формы:', error);
      
      // Обрабатываем ошибки валидации с сервера
      if (error.response && error.response.data && error.response.data.detail) {
        if (typeof error.response.data.detail === 'object') {
          // Если сервер вернул объект с ошибками по полям
          setErrors(error.response.data.detail);
        } else {
          // Если сервер вернул общую ошибку
          setErrors({ _general: error.response.data.detail });
        }
      } else {
        // Общая ошибка
        setErrors({ _general: error.message || 'Произошла ошибка при отправке формы' });
      }
    }
  };

  const renderField = (field) => {
    const value = formValues[field.name] || '';
    const error = errors[field.name];

    switch (field.type) {
      case 'textarea':
        return (
          <View key={field.name} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>{field.label}{field.required ? ' *' : ''}</Text>
            <TextInput
              style={[styles.input, styles.textArea, error && styles.inputError]}
              value={value}
              onChangeText={(text) => handleChange(field.name, text)}
              placeholder={field.placeholder || `Введите ${field.label.toLowerCase()}`}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>
        );
      
      case 'image':
        return (
          <View key={field.name} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>{field.label}{field.required ? ' *' : ''}</Text>
            <ImageUploader
              onImageUploaded={(imagePath) => handleChange(field.name, imagePath)}
              category={imageCategory}
              serverUrl={serverUrl}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>
        );
      
      case 'select':
        return (
          <View key={field.name} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>{field.label}{field.required ? ' *' : ''}</Text>
            <View style={[styles.input, error && styles.inputError]}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.optionsContainer}>
                  {field.options && field.options.map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.optionButton,
                        value === option.name && styles.selectedOption
                      ]}
                      onPress={() => handleChange(field.name, option.name)}
                    >
                      <Text style={[
                        styles.optionText,
                        value === option.name && styles.selectedOptionText
                      ]}>
                        {option.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>
        );
      
      default:
        return (
          <View key={field.name} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>{field.label}{field.required ? ' *' : ''}</Text>
            <TextInput
              style={[styles.input, error && styles.inputError]}
              value={value}
              onChangeText={(text) => handleChange(field.name, text)}
              placeholder={field.placeholder || `Введите ${field.label.toLowerCase()}`}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>
        );
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {errors._general && (
              <View style={styles.generalErrorContainer}>
                <Ionicons name="alert-circle" size={20} color="#ff4d4f" />
                <Text style={styles.generalErrorText}>{errors._general}</Text>
              </View>
            )}
            
            {fields.map(field => renderField(field))}

            {additionalComponents && additionalComponents}

            {selectedImage && (
              <View style={styles.previewContainer}>
                <Text style={styles.previewTitle}>Выбранное изображение</Text>
                <Image
                  source={{ uri: `${serverUrl}${selectedImage}` }}
                  style={styles.previewImage}
                  resizeMode="cover"
                />
              </View>
            )}
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={20} color="#fff" />
                  <Text style={styles.submitButtonText}>Отправить</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: SCREEN_WIDTH * 0.9,
    maxWidth: 500,
    maxHeight: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 16,
    maxHeight: '70%',
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  inputError: {
    borderColor: '#ff4d4f',
  },
  textArea: {
    minHeight: 100,
  },
  errorText: {
    color: '#ff4d4f',
    fontSize: 14,
    marginTop: 4,
  },
  generalErrorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff2f0',
    borderWidth: 1,
    borderColor: '#ffccc7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  generalErrorText: {
    color: '#ff4d4f',
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    maxWidth: 300,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  imagePreviewContainer: {
    marginTop: 10,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  previewContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#e9ecef',
  },
  optionsContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  selectedOption: {
    backgroundColor: '#0066cc',
  },
  optionText: {
    color: '#333',
    fontSize: 14,
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default FormModal; 