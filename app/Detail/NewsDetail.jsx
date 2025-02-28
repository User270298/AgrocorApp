// app/components/NewsDetail.js
import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Linking, SafeAreaView } from "react-native";
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
// import { URL_BASE } from '@env';
const URL_BASE = "http://192.168.1.105:8000";

export default function NewsDetail() {
  const route = useRoute(); // Получаем текущий маршрут
  const { title, content, image_url, date } = route.params; // Извлекаем параметры
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image
            source={
              fullImageUrl
                ? { uri: fullImageUrl }
                : require("../../assets/images/image/BARLEY.png")
            }
            style={styles.image}
          />
          <View style={styles.overlay} />
          <Text style={styles.title}>{title}</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Date Card */}
          <View style={styles.dateCard}>
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <Text style={styles.date}>{formatDate(date)}</Text>
          </View>

          {/* Content Card */}
          <View style={styles.contentCard}>
            <Text style={styles.contentTitle}>Описание</Text>
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
  dateCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
