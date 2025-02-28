import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
// import { URL_BASE } from '@env';
const URL_BASE = "http://192.168.1.103:8000";

// const BASE_URL = "http://example.com"; // Укажите ваш базовый URL

export default function AnalysisDetail() {
  const route = useRoute(); // Получаем текущий маршрут
  const { title, content, image_url, date } = route.params; // Извлекаем параметры

  // Полный URL для изображения
  const fullImageUrl = image_url ? `${URL_BASE}${image_url}` : null;

  console.log("Image URL:", fullImageUrl); // Для проверки

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Image
        source={
          fullImageUrl
            ? { uri: fullImageUrl } // Если URL валиден
            : require("../../assets/images/image/BARLEY.png") // Фолбек изображение
        }
        style={styles.image}
      />
      <Text style={styles.description}>{content}</Text>
      <Text style={styles.date}>{date}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8f2e9",
    padding: 20,
  },
  image: {
    width: "100%",
    height: 220,
    resizeMode: "cover",
    marginBottom: 20,
    borderRadius: 5,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#2e7d32",
    marginVertical: 25,
  },
  date: {
    fontSize: 16,
    color: "#757575",
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    color: "#424242",
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
