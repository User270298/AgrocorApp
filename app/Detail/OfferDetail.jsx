// app/components/NewsDetail.js
import React from "react";
import { View, Text, Image, StyleSheet, ScrollView , TouchableOpacity, Linking} from "react-native";
import { useRoute } from '@react-navigation/native';
// import { URL_BASE } from '@env';
const URL_BASE = "http://192.168.1.103:8000";

export default function NewsDetail() {
  const route = useRoute(); // Получаем текущий маршрут
  const { title, description, image_url, price, author, date } = route.params; // Извлекаем параметры
  const fullImageUrl = image_url ? `${URL_BASE}${image_url}` : null;
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Image
             source={
              fullImageUrl
                 ? { uri: fullImageUrl }
                 : require("../../assets/images/image/BARLEY.png")
             }
             style={styles.image}
           />
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.date}>Цена: {price} $</Text>
      <Text style={styles.date}>{date}</Text>
      <TouchableOpacity
              style={styles.button}
              onPress={() => Linking.openURL(author)}
            >
              <Text style={styles.buttonText}>Подробнее</Text>
            </TouchableOpacity>
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
    height: '130%',
    resizeMode: "cover",
    marginBottom: 20,
    borderRadius: 5,
  },
  title: {
    textAlign: 'center',
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
    backgroundColor: "#4CAF50",  // Зеленый фон для кнопки
    paddingVertical: 15,  // Вертикальные отступы
    paddingHorizontal: 20,  // Горизонтальные отступы
    borderRadius: 30,  // Скругленные углы для кнопки
    alignItems: "center",  // Выравнивание текста по центру
    marginTop: 20,  // Отступ сверху
    elevation: 5,  // Тень для кнопки
  },
  buttonText: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "white",  // Белый текст
  },
});


// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet } from "react-native";
// import * as Device from "expo-device";
// import * as SecureStore from "expo-secure-store";

// export default function DeviceIdScreen() {
//   const [deviceId, setDeviceId] = useState(null);

//   useEffect(() => {
//     const fetchDeviceId = async () => {
//       // Проверяем, есть ли уже сохранённый ID
//       let storedDeviceId = await SecureStore.getItemAsync("device-id");
//       if (!storedDeviceId) {
//         // Если нет, генерируем уникальный ID
//         storedDeviceId = `${Device.osBuildId || "unknown"}-${Date.now()}`;
//         await SecureStore.setItemAsync("device-id", storedDeviceId);
//       }
//       setDeviceId(storedDeviceId);
//     };

//     fetchDeviceId();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Device ID:</Text>
//       <Text style={styles.deviceId}>{deviceId || "Loading..."}</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#f5f5f5",
//   },
//   text: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   deviceId: {
//     fontSize: 16,
//     color: "#555",
//     marginTop: 10,
//   },
// });
