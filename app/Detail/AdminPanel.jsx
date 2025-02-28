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
} from "react-native";
import axios from "axios";
// import { URL_BASE } from "@env";
const URL_BASE = "http://192.168.1.103:8000";
import { Picker } from "@react-native-picker/picker";

console.log("Base URL:", URL_BASE);

// const URL_BASE = "http://192.168.1.104:8000";
export default function AdminPanel() {
  const [modalVisible, setModalVisible] = useState(false);
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
    if (endpoint === "offers" && data.price) {
      data.price = parseFloat(data.price);
    }

    if (Object.values(data).some((field) => !field)) {
      Alert.alert("Validation Error", "Обязательно заполнение всех полей.");
      console.log("Поля, которые отсутствуют:", data);
      return;
    }

    try {
      console.log("Отправляемые данные:", data);
      await axios.post(`${URL_BASE}/${endpoint}`, data, {
        headers: { "Content-Type": "application/json" },
      });
      Alert.alert("Success", `${endpoint} добавлено успешно`);
      resetCallback();
      setModalVisible(null);
    } catch (error) {
      console.log("Отправляемые данные:", data);
      console.error("Ошибка ответа API:", error.response?.data);
      Alert.alert("Error", "Произошла ошибка при добавлении.");
    }
  };

  const renderImagePicker = (images, setStateCallback) => {
    if (!Array.isArray(images) || images.length === 0) {
      return <Text>Нет доступных изображений</Text>;
    }

    return (
      <View style={styles.imageGridContainer}>
        {images.map((imageUrl, index) => (
          <TouchableOpacity
            key={index}
            onPress={() =>
              setStateCallback((prevState) => ({
                ...prevState,
                image_url: imageUrl,
              }))
            }
          >
            <Image
              source={{ uri: `${URL_BASE}${imageUrl}` }}
              style={styles.thumbnail}
            />
          </TouchableOpacity>
        ))}
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
        additionalRender: () => renderImagePicker(newsImages, setNews),
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
        additionalRender: () => {
          return (
            <>
              {renderAuthorPicker(config.setState, config.state.author)}
              {renderImagePicker(bestImages, setBest)}
            </>
          );
        },
      },
      analysis: {
        state: analysis,
        setState: setAnalysis,
        endpoint: "analysis",
        reset: () => setAnalysis({ title: "", content: "", image_url: "" }),
        additionalRender: () => renderImagePicker(analysisImages, setAnalysis),
      },
      catcher: {
        state: catcher,
        setState: setCatcher,
        endpoint: "catcher",
        reset: () => setCatcher({ title: "", description: "", image_url: "" }),
        additionalRender: () => renderImagePicker(vesselImages, setCatcher),
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
              {renderImagePicker(offerImages, setOffers)}
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
              {renderImagePicker(offerImages, setRequests)}
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
        <Text style={styles.modalHeader}>Добавить</Text>
        {Object.keys(config.state).map((field) =>
          field !== "image_url" &&
          field !== "author" &&
          field !== "second_tag" ? (
            <TextInput
              key={field}
              style={styles.input}
              placeholder={field}
              value={config.state[field]}
              onChangeText={(text) =>
                config.setState((prevState) => ({
                  ...prevState,
                  [field]: text,
                }))
              }
              keyboardType={field === "price" ? "numeric" : "default"}
            />
          ) : null
        )}

        <View style={styles.imagePickerWrapper}>
          {config.additionalRender ? config.additionalRender() : <Text>Нет доступных изображений</Text>}
        </View>
        {config.state.image_url ? (
          <Image
            source={{ uri: config.state.image_url }}
            style={styles.previewImage}
          />
        ) : null}
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleAdd(config.state, config.endpoint, config.reset)}
        >
          <Text style={styles.buttonText}>Добавить</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setModalVisible(null)}
        >
          <Text style={styles.buttonText}>Назад</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Admin Panel</Text>

      <Text style={styles.sectionTitle}>Главная страница</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible("news")}
      >
        <Text style={styles.buttonText}>Добавить новость</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible("best")}
      >
        <Text style={styles.buttonText}>Добавить предложение</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible("analysis")}
      >
        <Text style={styles.buttonText}>Добавить анализ</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Vessel Catcher</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible("catcher")}
      >
        <Text style={styles.buttonText}>Добавить новость в Vessel Catcher</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Offer и Request</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible("offers")}
      >
        <Text style={styles.buttonText}>Добавить Offer</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible("requests")}
      >
        <Text style={styles.buttonText}>Добавить Request</Text>
      </TouchableOpacity>

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
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 20,
    textAlign: "center",
    color: "#555",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignItems: "center",
    marginBottom: 12,
    alignSelf: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    width: "80%",
  },
  backButton: {
    backgroundColor: "#dc3545",
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
    width: "80%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  modalHeader: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#007bff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#fdfdfd",
    width: "100%",
    fontSize: 14,
    color: "#555",
  },
  imageGridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  thumbnail: {
    width: 65,
    height: 70,
    margin: 3,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  previewImage: {
    width: 220,
    height: 220,
    marginVertical: 20,
    borderRadius: 16,
    alignSelf: "center",
    backgroundColor: "#f5f5f5",
  },
  authorPickerContainer: {
    marginTop: 10,
  },
  authorButton: {
    padding: 10,
    backgroundColor: "#84cdfa",
    marginVertical: 7,
    borderRadius: 5,
  },
  authorButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  categoryPickerContainer: {
    marginTop: 10,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#555",
  },
});
