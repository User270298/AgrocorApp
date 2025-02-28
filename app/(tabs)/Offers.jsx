import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
// import { URL_BASE } from '@env';  

// const URL_BASE=URL_BASE
const URL_BASE = "http://192.168.1.103:8000";
export const fetchOffers = async () => {
  try {
    const response = await axios.get(`${URL_BASE}/offers`);
    return response.data;
  } catch (error) {
    console.error("Error fetching offers:", error);
    throw error;
  }
};

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigation = useNavigation();
  const categories = [
    "all",
    "PULSES",
    "GRAINS",
    "DEEP WATER",
    "CONTAINERS",
    "OILS",
    "FEED STAFF",
    "CHINA",
  ];

  useEffect(() => {
    const loadOffers = async () => {
      try {
        const data = await fetchOffers();
        setOffers(data);
      } catch (error) {
        console.error("Error loading offers:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOffers();
  }, []);

  const filteredOffers =
    selectedCategory === "all"
      ? offers
      : offers.filter((offer) => offer.second_tag === selectedCategory);

  const renderCategoryButton = (category) => (
    <TouchableOpacity
      key={category}
      style={
        selectedCategory === category
          ? [styles.categoryButton, styles.selectedCategoryButton]
          : styles.categoryButton
      }
      onPress={() => setSelectedCategory(category)}
    >
      <Text
        style={
          selectedCategory === category
            ? [styles.categoryText, styles.selectedCategoryText]
            : styles.categoryText
        }
      >
        {category.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={
          item.image_url
            ? { uri: `${URL_BASE}/static/image/${item.image_url.split("/").pop()}` }
            : require("../../assets/images/image/BARLEY.png") // Фолбэк изображение
        }
        style={styles.image}
      />
      <Text style={styles.title}>{item.crop_name}</Text>
      <Text style={styles.detail}>Количество: {item.quantity}</Text>
      <Text style={styles.detail}>Цена: {item.seller || item.bayer}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.push("Detail/OfferDetailScreen", { item })}
      >
        <Text style={styles.buttonText}>Подробнее</Text>
      </TouchableOpacity>
    </View>
  );
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4caf50" />
        <Text>Загрузка...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={() => (
          <View>
            <Text style={styles.headerText}>Offers</Text>
            <View style={styles.categoryContainer}>
              {categories.map(renderCategoryButton)}
            </View>
          </View>
        )}
        data={filteredOffers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={[
          styles.row,
          filteredOffers.length % 2 !== 0 && styles.singleItemRow,
        ]}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8f2e9",
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  list: {
    paddingBottom: 10,
  },
  row: {
    justifyContent: "space-around",
    marginBottom: 10,
  },
  singleItemRow: {
    justifyContent: "center",
  },
  headerText: {
    fontSize: 36,
    textAlign: "center",
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 15,
  },
  categoryContainer: {
    flexDirection: "row", // Горизонтальное размещение кнопок
    flexWrap: "wrap", // Перенос кнопок на следующую строку
    marginBottom: 10,
    justifyContent: "center", // Центрируем кнопки
  },
  categoryButton: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    margin: 5, // Отступ вокруг кнопок
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedCategoryButton: {
    backgroundColor: "#4caf50",
  },
  categoryText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
  },
  selectedCategoryText: {
    color: "#fff",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 6,
    width: "45%",
    marginHorizontal: 6,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    alignItems: "center",
    aspectRatio: 3 / 4, // Высота пропорциональна ширине
    justifyContent: "space-around", // Равномерно распределяем содержимое
  },
  image: {
    width: "70%",
    height: "50%",
    borderRadius: 10,
    resizeMode: "cover",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  detail: {
    fontSize: 12,
    color: "#555",
  },
  button: {
    backgroundColor: "#4caf50",
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 5,
    alignSelf: "center", // Центрируем кнопку внутри карточки
    width: "90%", // Устанавливаем ширину кнопки относительно карточки
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
  },
});
