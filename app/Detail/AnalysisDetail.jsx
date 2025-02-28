import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { useRoute } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
// import { URL_BASE } from '@env';
const URL_BASE = "http://192.168.1.105:8000";

// const BASE_URL = "http://example.com"; // Укажите ваш базовый URL

export default function AnalysisDetail() {
  const route = useRoute(); // Получаем текущий маршрут
  const { title, content, image_url, date } = route.params; // Извлекаем параметры

  // Полный URL для изображения
  const fullImageUrl = image_url ? `${URL_BASE}${image_url}` : null;

  const formatDate = (dateString) => {
    try {
      if (!dateString) return '';
      
      // Предполагаем, что дата приходит в формате "YYYY-MM-DD" или ISO string
      const date = new Date(dateString);
      
      // Проверяем валидность даты
      if (isNaN(date.getTime())) {
        return dateString; // Возвращаем исходную строку, если дата невалидная
      }

      const options = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      };

      return date.toLocaleDateString('ru-RU', options);
    } catch (error) {
      console.log('Error formatting date:', error);
      return dateString; // В случае ошибки возвращаем исходную строку
    }
  };

  console.log("Image URL:", fullImageUrl); // Для проверки

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image
            source={
              fullImageUrl
                ? { uri: fullImageUrl } // Если URL валиден
                : require("../../assets/images/image/BARLEY.png") // Фолбек изображение
            }
            style={styles.image}
          />
          <View style={styles.overlay} />
          <Text style={styles.title}>{title}</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Category and Date */}
          <View style={styles.metaCard}>
            <View style={styles.categoryContainer}>
              <Ionicons name="analytics-outline" size={20} color="#2e7d32" />
              <Text style={styles.category}>Аналитика</Text>
            </View>
            <View style={styles.dateContainer}>
              <Ionicons name="calendar-outline" size={20} color="#666" />
              <Text style={styles.date}>{formatDate(date)}</Text>
            </View>
          </View>

          {/* Analysis Content */}
          <View style={styles.contentCard}>
            <Text style={styles.contentTitle}>Анализ рынка</Text>
            <Text style={styles.description}>{content}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  title: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
  },
  metaCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  category: {
    fontSize: 16,
    color: '#2e7d32',
    fontWeight: '600',
    marginLeft: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  contentCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  contentTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  button: {
    backgroundColor: "#4CAF50", // Зеленый фон для кнопки
    paddingVertical: 15, // Вертикальные отступы
    paddingHorizontal: 20, // Горизонтальные отступы
    borderRadius: 30, // Скругленные углы для кнопки
    alignItems: "center", // Выравнивание текста по центру
    marginTop: 20, // Отступ сверху
    elevation: 5, // Тень для кнопки
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white", // Белый текст
  },
});
