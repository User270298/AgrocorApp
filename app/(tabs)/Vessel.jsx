import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  TextInput,
  ScrollView,
  Image,
  Alert,
  Dimensions,
  FlatList,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
// import { URL_BASE } from "@env";

// const URL_BASE = "http://192.168.1.104:8000";
// const URL_BASE=URL_BASE
const URL_BASE = "http://192.168.1.103:8000";

const { width: screenWidth } = Dimensions.get('window');

export default function Vessel() {
  const [isModalVisible, setModalVisible] = useState(false);

  const [postType, setPostType] = useState("cargo"); // Выбор между cargo и vessel
  const [postData, setPostData] = useState({});
  const [posts, setPosts] = useState([]);
  const [news, setNews] = useState([]);
  const router = useRouter();
  const bestOffers = news;

  const fetchNews = async () => {
    try {
      const response = await axios.get(`${URL_BASE}/catcher`);
      setNews(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке новостей:", error.message);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${URL_BASE}/vessel?status=approved`);
      setPosts(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке предложений:", error.message);
    }
  };

  function formatDate(dateString) {
    if (!dateString) return ""; // Обрабатываем случай, если dateString отсутствует
  
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Месяцы начинаются с 0
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
  
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }
  
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.carouselItem}
      onPress={() => {
        router.push({
          pathname: "/Detail/VesselDetail",
          params: { ...item },
        });
      }}
    >
      <Image
        source={
          item.image_url
            ? {
                uri: `${URL_BASE}/static/vessel_catcher/${item.image_url.split("/").pop()}`,
              }
            : require("../../assets/images/image/BARLEY.png") // Фallback изображение
        }
        style={styles.carouselImage}
      />
      <Text style={styles.carouselTitle}>{item.title || 'Заголовок'}</Text>
      <Text style={styles.newsDate}>{formatDate(item.date)}</Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    fetchNews();
    fetchPosts();
  }, []);

  const handleAddPost = async () => {
    const requiredFields =
      postType === "cargo"
        ? [
            "date_at",
            "cargo",
            "quantity",
            "port_loading",
            "port_discharge",
            "rates",
            "laycan",
          ]
        : ["dwt", "blt", "flag", "open_at", "availability"];

    const missingFields = requiredFields.filter((field) => !postData[field]);
    if (missingFields.length > 0) {
      Alert.alert("Ошибка", `Заполните все поля: ${missingFields.join(", ")}`);
      return;
    }

    try {
      const url =
        postType === "cargo" ? `${URL_BASE}/cargo` : `${URL_BASE}/vessel`;

      console.log("Отправляемые данные:", postData);
      await axios.post(url, postData);
      Alert.alert("Успех!", `Ваш ${postType} успешно отправлен на проверку.`);
      setPostData({});
      setModalVisible(false);
      fetchPosts(); // Обновляем список после отправки
    } catch (error) {
      console.error(
        "Ошибка при отправке:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Vessel Catcher</Text>
      </View>
      
      <View style={styles.carouselContainer}>
        <Text style={styles.sectionTitle}>Новости Vessel Catcher</Text>
        <FlatList
          data={news}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.newsContainer}
        />
      </View>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Добавить {postType === "cargo" ? "Cargo" : "Vessel"}
            </Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  postType === "cargo" && styles.selectedButton,
                ]}
                onPress={() => setPostType("cargo")}
              >
                <Text style={styles.toggleButtonText}>Cargo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  postType === "vessel" && styles.selectedButton,
                ]}
                onPress={() => setPostType("vessel")}
              >
                <Text style={styles.toggleButtonText}>Vessel</Text>
              </TouchableOpacity>
            </View>

            {postType === "cargo" ? (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Date at (YYYY-MM-DD)"
                  value={postData.date_at || ""}
                  onChangeText={(text) =>
                    setPostData((prev) => ({ ...prev, date_at: text }))
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder="Cargo"
                  value={postData.cargo || ""}
                  onChangeText={(text) =>
                    setPostData((prev) => ({ ...prev, cargo: text }))
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder="Quantity"
                  value={postData.quantity || ""}
                  onChangeText={(text) =>
                    setPostData((prev) => ({ ...prev, quantity: text }))
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder="Port of Loading"
                  value={postData.port_loading || ""}
                  onChangeText={(text) =>
                    setPostData((prev) => ({ ...prev, port_loading: text }))
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder="Port of Discharge"
                  value={postData.port_discharge || ""}
                  onChangeText={(text) =>
                    setPostData((prev) => ({ ...prev, port_discharge: text }))
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder="Rates"
                  value={postData.rates || ""}
                  onChangeText={(text) =>
                    setPostData((prev) => ({ ...prev, rates: text }))
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder="Laycan Dates"
                  value={postData.laycan || ""}
                  onChangeText={(text) =>
                    setPostData((prev) => ({ ...prev, laycan: text }))
                  }
                />
              </>
            ) : (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="DWT"
                  value={postData.dwt || ""}
                  onChangeText={(text) =>
                    setPostData((prev) => ({ ...prev, dwt: text }))
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder="BLT"
                  value={postData.blt || ""}
                  onChangeText={(text) =>
                    setPostData((prev) => ({ ...prev, blt: text }))
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder="Flag"
                  value={postData.flag || ""}
                  onChangeText={(text) =>
                    setPostData((prev) => ({ ...prev, flag: text }))
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder="Open at"
                  value={postData.open_at || ""}
                  onChangeText={(text) =>
                    setPostData((prev) => ({ ...prev, open_at: text }))
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder="Availability"
                  value={postData.availability || ""}
                  onChangeText={(text) =>
                    setPostData((prev) => ({ ...prev, availability: text }))
                  }
                />
              </>
            )}
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleAddPost}
            >
              <Text style={styles.modalButtonText}>Добавить</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setModalVisible(null)}
            >
              <Text style={styles.buttonText}>Назад</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#e9f5e9" 
  },
  header: { 
    alignItems: "center", 
    marginVertical: 26 
  },
  headerText: { 
    fontSize: 30, 
    fontWeight: "bold", 
    color: "#2a7b3d" 
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  toggleButton: {
    padding: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#2a7b3d",
    borderRadius: 5,
    width: 100,
    alignItems: "center",
    backgroundColor: "#93dba3",
  },
  selectedButton: {
    backgroundColor: "#2a7b3d",
  },
  toggleButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#2a7b3d",
    padding: 10,
    borderRadius: 5,
    marginVertical: 15,
    alignSelf: "center",
    width: 250,
    alignItems: "center",
  },
  addButtonText: { color: "#fff", fontWeight: "bold" },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2a7b3d",
    marginBottom: 15,
  },
  newsContainer: {
    paddingHorizontal: 10,
  },
  carouselContainer: {
    marginVertical: 20,
  },
  carouselItem: {
    width: screenWidth * 0.7,
    marginHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  carouselImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  carouselTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  newsDate: {
    fontSize: 12,
    color: '#666',
  },
  post: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postType: { fontWeight: "bold", marginBottom: 5, color: "#2a7b3d" },
  adminActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  approveButton: {
    backgroundColor: "#38b34a",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  rejectButton: {
    backgroundColor: "#ff5252",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#2a7b3d",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: "#2a7b3d",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 8,
    alignSelf: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    width: "70%",
  },
  modalButtonText: { color: "#fff", fontWeight: "bold" },
  backButton: {
    backgroundColor: "red",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 8,
    alignSelf: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    width: "70%",
  },
});
