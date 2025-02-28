import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Platform,
} from "react-native";
import axios from "axios";
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
// import { URL_BASE } from "@env";
const URL_BASE = "http://192.168.1.103:8000";
import { Picker } from "@react-native-picker/picker";

console.log("Base URL:", URL_BASE);

// const URL_BASE = "http://192.168.1.104:8000";
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AdminPanel() {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState({ title: "", content: "", image_url: "" });
  const [best, setBest] = useState({
    title: "",
    description: "",
    price: "",
    image_url: "",
    author: "https://wa.me/1234567890",
  });
  const [analysis, setAnalysis] = useState({
    title: "",
    content: "",
    image_url: "",
  });
  const [catcher, setCatcher] = useState({
    title: "",
    description: "",
    image_url: "",
  });
  const [images, setImages] = useState([]);
  const [offers, setOffers] = useState({
    crop_name: "",
    quantity: "",
    port: "",
    shipment_period: "",
    seller: "",
    second_tag: "PULSES",
    country: "",
    author: "https://wa.me/1234567890",
    image_url: "",
  });
  const [requests, setRequests] = useState({
    crop_name: "",
    quantity: "",
    port: "",
    shipment_period: "",
    bayer: "",
    second_tag: "PULSES",
    country: "",
    author: "https://wa.me/1234567890",
    image_url: "",
  });

  const categories = [
    "PULSES",
    "GRAINS",
    "DEEP WATER",
    "CONTAINERS",
    "OILS",
    "FEED STAFF",
    "CHINA",
  ];
  const [newsImages, setNewsImages] = useState([]);
  const [bestImages, setBestImages] = useState([]);
  const [analysisImages, setAnalysisImages] = useState([]);
  const [vesselImages, setVesselImages] = useState([]);
  const [offerImages, setOfferImages] = useState([]);
  const authors = [
    { name: "Oleg", whatsapp: "https://wa.me/1234567890" },
    { name: "Ira", whatsapp: "https://wa.me/0987654321" },
    { name: "Kostya", whatsapp: "https://wa.me/1122334455" },
  ];
  const renderAuthorPicker = (setStateCallback, selectedAuthor) => {
    if (!setStateCallback) {
      console.error("setStateCallback is undefined in renderAuthorPicker");
      return null;
    }
    return (
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerTitle}>Выберите автора:</Text>
        <Picker
          selectedValue={selectedAuthor || authors[0].name}
          onValueChange={(itemValue) => {
            const selected = authors.find(
              (author) => author.name === itemValue
            );
            setStateCallback((prevState) => ({
              ...prevState,
              author: selected ? selected.whatsapp : "",
            }));
          }}
        >
          {authors.map((author) => (
            <Picker.Item
              key={author.name}
              label={author.name}
              value={author.name}
            />
          ))}
        </Picker>
      </View>
    );
  };

  const renderPicker = (setStateCallback, options, selectedValue, key) => {
    if (!setStateCallback) {
      console.error(`setStateCallback is undefined in renderPicker for key: ${key}`);
      return null;
    }
    return (
      <View style={{ marginBottom: 15 }}>
        <Text style={{ fontSize: 16, marginBottom: 5 }}>Выберите {key}:</Text>
        <Picker
          selectedValue={selectedValue || options[0]}
          onValueChange={(itemValue) => {
            setStateCallback((prevState) => ({
              ...prevState,
              [key]: itemValue,
            }));
          }}
          style={{ height: 50, width: '100%', backgroundColor: '#f0f0f0' }}
        >
          {options.map((option) => (
            <Picker.Item key={option} label={option} value={option} />
          ))}
        </Picker>
      </View>
    );
  };

  useEffect(() => {
    const fetchImages = async (category, setState) => {
      try {
        const response = await axios.get(
          `${URL_BASE}/api/images?category=${category}`
        );
        const { images } = response.data;
        setState(Array.isArray(images) ? images : []);
      } catch (error) {
        console.error(
          `Ошибка загрузки изображений для ${category}:`,
          error.message
        );
        setState([]);
      }
    };

    fetchImages("news_image", setNewsImages);
    fetchImages("image", setBestImages); // Для предложений
    fetchImages("analysis_image", setAnalysisImages);
    fetchImages("vessel_image", setVesselImages);
    fetchImages("image", setOfferImages); // Для запросов и предложений
  }, []);

  const selectImage = (imageUrl, setStateCallback) => {
    setStateCallback((prevState) => ({ ...prevState, image_url: imageUrl }));
  };

  const handleAdd = async (data, endpoint, resetCallback) => {
    if (!validateFields(data)) {
      return;
    }

    setLoading(true);
    try {
      if (endpoint === "offers" && data.price) {
        data.price = parseFloat(data.price);
      }

      await axios.post(`${URL_BASE}/${endpoint}`, data, {
        headers: { "Content-Type": "application/json" },
      });
      
      Alert.alert(
        "Успешно", 
        `${getEndpointTitle(endpoint)} успешно добавлен(а)`,
        [{ text: "OK", onPress: () => {
          resetCallback();
          setModalVisible(null);
        }}]
      );
    } catch (error) {
      console.error("API Error:", error.response?.data);
      Alert.alert(
        "Ошибка",
        `Не удалось добавить ${getEndpointTitle(endpoint).toLowerCase()}. Попробуйте еще раз.`
      );
    } finally {
      setLoading(false);
    }
  };

  const validateFields = (data) => {
    const emptyFields = Object.entries(data)
      .filter(([key, value]) => !value && key !== 'image_url')
      .map(([key]) => key);

    if (emptyFields.length > 0) {
      Alert.alert(
        "Ошибка валидации",
        `Пожалуйста, заполните следующие поля:\n${emptyFields.join('\n')}`
      );
      return false;
    }
    return true;
  };

  const getEndpointTitle = (endpoint) => {
    const titles = {
      news: "Новость",
      best: "Предложение",
      analysis: "Анализ",
      catcher: "Vessel Catcher",
      offers: "Предложение",
      requests: "Запрос"
    };
    return titles[endpoint] || endpoint;
  };

  const renderField = (field, value, onChange, config) => {
    const fieldLabels = {
      title: "Заголовок",
      content: "Содержание",
      description: "Описание",
      price: "Цена",
      crop_name: "Название культуры",
      quantity: "Количество",
      port: "Порт",
      shipment_period: "Период поставки",
      seller: "Продавец",
      bayer: "Покупатель",
      country: "Страна"
    };

    return (
      <View style={styles.fieldContainer} key={field}>
        <Text style={styles.fieldLabel}>{fieldLabels[field] || field}</Text>
        <TextInput
          style={[
            styles.input,
            field === 'content' || field === 'description' ? styles.multilineInput : null
          ]}
          placeholder={`Введите ${fieldLabels[field].toLowerCase()}`}
          value={value}
          onChangeText={onChange}
          multiline={field === 'content' || field === 'description'}
          numberOfLines={field === 'content' || field === 'description' ? 4 : 1}
          keyboardType={field === 'price' ? 'numeric' : 'default'}
        />
      </View>
    );
  };

  const pickImage = async (category) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const newFileName = `${Date.now()}.jpg`;
        const destFolder = `${FileSystem.documentDirectory}assets/images/${category}/`;
        
        // Создаем директорию, если она не существует
        await FileSystem.makeDirectoryAsync(destFolder, { intermediates: true });
        
        // Копируем файл
        const newUri = destFolder + newFileName;
        await FileSystem.copyAsync({
          from: result.assets[0].uri,
          to: newUri
        });

        // Обновляем состояние в зависимости от категории
        const imageUrl = `/assets/images/${category}/${newFileName}`;
        switch(category) {
          case 'news_image':
            setNewsImages([...newsImages, imageUrl]);
            break;
          case 'analysis_image':
            setAnalysisImages([...analysisImages, imageUrl]);
            break;
          case 'vessel_image':
            setVesselImages([...vesselImages, imageUrl]);
            break;
          case 'image':
            setOfferImages([...offerImages, imageUrl]);
            setBestImages([...bestImages, imageUrl]);
            break;
        }

        Alert.alert("Успешно", "Изображение загружено");
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Ошибка", "Не удалось загрузить изображение");
    }
  };

  const renderImageSection = (images, setStateCallback, category) => {
    return (
      <View style={styles.imageSection}>
        <View style={styles.imageSectionHeader}>
          <Text style={styles.sectionTitle}>Выберите изображение</Text>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => pickImage(category)}
          >
            <Ionicons name="cloud-upload-outline" size={24} color="#fff" />
            <Text style={styles.uploadButtonText}>Загрузить</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.imageGridContainer}>
            {images.map((imageUrl, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => selectImage(imageUrl, setStateCallback)}
                style={styles.thumbnailContainer}
              >
                <Image
                  source={{ uri: `${FileSystem.documentDirectory}${imageUrl.substring(1)}` }}
                  style={styles.thumbnail}
                />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderModalContent = () => {
    const modalConfig = {
      news: {
        state: news,
        setState: setNews,
        endpoint: "news",
        reset: () => setNews({ title: "", content: "", image_url: "" }),
        additionalRender: () => renderImageSection(newsImages, setNews, "news_image"),
      },
      best: {
        state: best,
        setState: setBest,
        endpoint: "best",
        reset: () =>
          setBest({
            title: "",
            description: "",
            price: "",
            image_url: "",
            author: authors[0].whatsapp,
          }),
        additionalRender: () => (
          <>
            {renderAuthorPicker(setBest, best.author)}
            {renderImageSection(bestImages, setBest, "image")}
          </>
        ),
      },
      analysis: {
        state: analysis,
        setState: setAnalysis,
        endpoint: "analysis",
        reset: () => setAnalysis({ title: "", content: "", image_url: "" }),
        additionalRender: () => renderImageSection(analysisImages, setAnalysis, "analysis_image"),
      },
      catcher: {
        state: catcher,
        setState: setCatcher,
        endpoint: "catcher",
        reset: () => setCatcher({ title: "", description: "", image_url: "" }),
        additionalRender: () => renderImageSection(vesselImages, setCatcher, "vessel_image"),
      },
      offers: {
        state: offers,
        setState: setOffers,
        endpoint: "offers",
        reset: () =>
          setOffers({
            crop_name: "",
            quantity: "",
            port: "",
            shipment_period: "",
            seller: "",
            second_tag: categories[0],
            country: "",
            author: authors[0].whatsapp,
            image_url: "",
          }),
        additionalRender: () => {
          return (
            <>
              {renderAuthorPicker(config.setState, config.state.author)}
              {renderPicker(config.setState, categories, config.state.second_tag, "second_tag")}
              {renderImageSection(offerImages, setOffers, "image")}
            </>
          );
        },
      },
      requests: {
        state: requests,
        setState: setRequests,
        endpoint: "requests",
        reset: () =>
          setRequests({
            crop_name: "",
            quantity: "",
            port: "",
            shipment_period: "",
            bayer: "",
            second_tag: categories[0],
            country: "",
            author: authors[0].whatsapp,
            image_url: "",
          }),
        additionalRender: () => {
          return (
            <>
              {renderAuthorPicker(config.setState, config.state.author)}
              {renderPicker(config.setState, categories, config.state.second_tag, "second_tag")}
              {renderImageSection(offerImages, setRequests, "image")}
            </>
          );
        },
      },
    };

    const config = modalConfig[modalVisible];
    if (!config) return null;

    return (
      <View style={styles.modalContent}>
        <ScrollView nestedScrollEnabled={true}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Добавить {getEndpointTitle(config.endpoint)}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(null)}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {Object.entries(config.state).map(([field, value]) =>
            field !== "image_url" &&
            field !== "author" &&
            field !== "second_tag" ? (
              renderField(field, value, (text) =>
                config.setState((prevState) => ({
                  ...prevState,
                  [field]: text,
                }))
              )
            ) : null
          )}

          <View style={styles.imageSection}>
            {config.additionalRender()}
          </View>

          {config.state.image_url && (
            <View style={styles.previewContainer}>
              <Text style={styles.previewTitle}>Предпросмотр</Text>
              <Image
                source={{ uri: `${URL_BASE}${config.state.image_url}` }}
                style={styles.previewImage}
              />
            </View>
          )}

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.disabledButton]}
            onPress={() => handleAdd(config.state, config.endpoint, config.reset)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="add-circle-outline" size={24} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.submitButtonText}>Добавить</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Ionicons name="settings-outline" size={30} color="#007bff" />
        <Text style={styles.header}>Панель управления</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Главная страница</Text>
        <View style={styles.buttonGroup}>
          {[
            { title: "Добавить новость", action: "news", icon: "newspaper-outline" },
            { title: "Добавить предложение", action: "best", icon: "pricetag-outline" },
            { title: "Добавить анализ", action: "analysis", icon: "analytics-outline" }
          ].map((item) => (
            <TouchableOpacity
              key={item.action}
              style={styles.button}
              onPress={() => setModalVisible(item.action)}
            >
              <Ionicons name={item.icon} size={24} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vessel Catcher</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setModalVisible("catcher")}
        >
          <Ionicons name="boat-outline" size={24} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Добавить новость в Vessel Catcher</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Предложения и запросы</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setModalVisible("offers")}
          >
            <Ionicons name="cart-outline" size={24} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Добавить Offer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setModalVisible("requests")}
          >
            <Ionicons name="search-outline" size={24} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Добавить Request</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={!!modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(null)}
      >
        <View style={styles.modalOverlay}>{renderModalContent()}</View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    paddingVertical: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#007bff",
    marginLeft: 10,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  buttonGroup: {
    gap: 12,
  },
  button: {
    backgroundColor: "#007bff",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: SCREEN_WIDTH * 0.9,
    maxHeight: '90%',
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
  },
  closeButton: {
    padding: 8,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#333",
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  previewContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 16,
    backgroundColor: "#f5f5f5",
  },
  submitButton: {
    backgroundColor: "#28a745",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.7,
  },
  imageSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28a745',
    padding: 8,
    borderRadius: 8,
    gap: 8,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  imageGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 4,
  },
  thumbnailContainer: {
    margin: 4,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  thumbnail: {
    width: (SCREEN_WIDTH * 0.9 - 64) / 4,
    height: (SCREEN_WIDTH * 0.9 - 64) / 4,
    backgroundColor: '#f5f5f5',
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerTitle: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
    fontWeight: "500",
  },
});
