import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from "react-native";
import { useRoute } from "@react-navigation/native";
// import { URL_BASE } from '@env';
const URL_BASE = "http://192.168.1.103:8000";
export default function OfferDetailScreen() {
  const route = useRoute();
  const { params } = route;
  
  if (!params || !params.item) {
    return (
      <View style={styles.container}>
        <Text>Нет данных для отображения</Text>
      </View>
    );
  }

  const {
    crop_name,
    quantity,
    port,
    shipment_period,
    seller,
    bayer,
    country,
    author,
    image_url,
    date,
  } = params.item;
  const fullImageUrl = image_url ? `${URL_BASE}${image_url}` : null;
  return (
    <View style={styles.container}>
      <Image source={{ uri: fullImageUrl }} style={styles.image} />
      <Text style={styles.title}>{crop_name}</Text>
      <Text style={styles.detail}>Количество: {quantity}</Text>
      <Text style={styles.detail}>Порт: {port}</Text>
      <Text style={styles.detail}>Период: {shipment_period}</Text>
      <Text style={styles.detail}>
        Цена: {seller || bayer}
      </Text>
      <Text style={styles.detail}>Страна: {country}</Text>
      <Text style={styles.detail}>Дата: {date}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => Linking.openURL(author)}
      >
        <Text style={styles.buttonText}>Связаться</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  image: {
    width: "100%",
    height: "50%",
    borderRadius: 15,
    marginBottom: 20,
    resizeMode: "cover",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  detail: {
    fontSize: 18,
    color: "#555",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});
