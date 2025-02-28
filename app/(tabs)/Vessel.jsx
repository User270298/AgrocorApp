import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  ScrollView,
  Alert,
  Dimensions,
  FlatList,
  RefreshControl,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import { VesselNewsCard } from "../../components/VesselNewsCard";
import { VesselForm } from "../../components/VesselForm";
import { theme } from "../../theme";

const URL_BASE = "http://192.168.1.103:8000";
const { width: screenWidth } = Dimensions.get('window');

export default function Vessel() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [postType, setPostType] = useState("cargo"); // Выбор между cargo и vessel
  const [postData, setPostData] = useState({});
  const [posts, setPosts] = useState([]);
  const [news, setNews] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchNews(), fetchPosts()]);
    setIsRefreshing(false);
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

  useEffect(() => {
    fetchNews();
    fetchPosts();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>Vessel Catcher</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addButtonText}>+ Добавить</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Новости Vessel Catcher</Text>
          <FlatList
            data={news}
            renderItem={({ item }) => (
              <VesselNewsCard
                title={item.title || 'Заголовок'}
                date={formatDate(item.date)}
                imageUrl={
                  item.image_url
                    ? `${URL_BASE}/static/vessel_catcher/${item.image_url.split('/').pop()}`
                    : undefined
                }
                defaultImage={require('../../assets/images/image/BARLEY.png')}
                onPress={() => {
                  router.push({
                    pathname: '/Detail/VesselDetail',
                    params: { ...item },
                  });
                }}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.newsContainer}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Последние предложения</Text>
          {posts.map((post, index) => (
            <TouchableOpacity
              key={index}
              style={styles.postCard}
              onPress={() => {
                router.push({
                  pathname: '/Detail/VesselDetail',
                  params: { ...post },
                });
              }}
            >
              <Text style={styles.postTitle}>{post.title || 'Без названия'}</Text>
              <Text style={styles.postDate}>{formatDate(post.date)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView style={styles.modalScrollView}>
            <VesselForm
              postType={postType}
              postData={postData}
              onChangePostData={setPostData}
              onSubmit={handleAddPost}
              onToggleType={setPostType}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Закрыть</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.lg,
  },
  addButtonText: {
    color: theme.colors.white,
    fontWeight: '600',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 16,
  },
  newsContainer: {
    paddingRight: 16,
  },
  postCard: {
    backgroundColor: theme.colors.backgroundSecondary,
    padding: 16,
    borderRadius: theme.borderRadius.lg,
    marginBottom: 12,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  postDate: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalScrollView: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    padding: 16,
    maxHeight: '80%',
  },
  closeButton: {
    backgroundColor: theme.colors.backgroundSecondary,
    padding: 16,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    color: theme.colors.text,
    fontWeight: '600',
    fontSize: 16,
  },
});
