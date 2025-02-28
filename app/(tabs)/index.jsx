import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
// import Carousel from "react-native-snap-carousel";
import { useRouter } from "expo-router";
import axios from "axios";
import * as Device from "expo-device";
// import { URL_BASE } from '@env';

// const URL_BASE=URL_BASE
const URL_BASE = "http://192.168.1.103:8000";
const adminDeviceId = "TP1A.220624.014";
// const URL_BASE = "http://192.168.1.104:8000";
const transformQuotes = (data) => {
  const keyMapping = {
    Barley: "Barley MOEX",
    Corn: "Corn MOEX",
    Corn_CHICAGO: "Corn CHICAGO",
    Rapeseed: "Rapeseed MATIF",
    Soybeans_CHICAGO: "Soybeans CHICAGO",
    Wheat: "Wheat MOEX",
    Wheat_CHICAGO: "Wheat CHICAGO",
    Corn_matif: "Corn MATIF",
    btc_price: "BITCOIN",
    eur_rub: "EUR/RUB",
    oil_price: "Petroleum",
    usd_cny: "USD/CNY",
    usd_rub: "USD/RUB",
    usd_try: "USD/TRY",
    Wheat_matif: "Wheat MATIF",
  };

  const unitMapping = {
    BITCOIN: "₽",
    "EUR/RUB": "₽",
    Petroleum: "$",
    "USD/CNY": "¥",
    "USD/RUB": "₽",
    "USD/TRY": "₺",
    "Barley MOEX": "$",
    "Corn MOEX": "$",
    "Wheat MOEX": "$",
    "Corn CHICAGO": "$",
    "Rapeseed MATIF": "$",
    "Soybeans CHICAGO": "$",
    "Wheat CHICAGO": "$",
    "Corn MATIF": "$",
    "Wheat MATIF": "$",
  };

  return Object.entries(data).map(([key, value]) => {
    const newKey = keyMapping[key] || key;
    const displayValue = `${value?.current_price || value} ${
      unitMapping[newKey] || ""
    }`.trim();
    return { key: newKey, value: displayValue };
  });
};

export default function MainScreen() {
  const router = useRouter();
  const [offers, setOffers] = useState([]);
  const [internalNews, setInternalNews] = useState([]);
  const [externalAnalyzis, setExternalAnalyzis] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [isAdminUser, setIsAdminUser] = useState(false);

  const fetchQuotes = async () => {
    try {
      const response = await axios.get(`${URL_BASE}/quotes`);
      const transformedData = transformQuotes(response.data.quotes);
      setQuotes(transformedData);
    } catch (error) {
      console.error("Error fetching quotes:", error.message);
    }
  };

  const fetchNews = async () => {
    try {
      const response = await axios.get(`${URL_BASE}/news`);
      setInternalNews(response.data);
    } catch (error) {
      console.error("Error fetching news:", error.message);
    }
  };

  const fetchOffers = async () => {
    try {
      const response = await axios.get(`${URL_BASE}/best`);
      setOffers(response.data);
    } catch (error) {
      console.error("Error fetching offers:", error.message);
    }
  };

  const fetchAnalysis = async () => {
    try {
      const response = await axios.get(`${URL_BASE}/analysis`);
      setExternalAnalyzis(response.data);
    } catch (error) {
      console.error("Error fetching analysis:", error.message);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentDeviceId = Device.osBuildId;
        setIsAdminUser(currentDeviceId === adminDeviceId);
        console.log("OS Build ID: ", Device.osBuildId); // Выводим ID устройства
        await Promise.all([
          // fetchQuotes(),
          fetchNews(),
          fetchOffers(),
          fetchAnalysis(),
        ]);
      } catch (error) {
        console.error("Error loading data:", error.message);
      }
    };

    loadData();

    const interval = setInterval(loadData, 60 * 60 * 1000); // Обновление данных каждый час
    return () => clearInterval(interval);
  }, []);

  const renderCarouselItem = ({ item, type, categoryPath }) => (
    <TouchableOpacity
      style={styles.carouselItem}
      onPress={() => {
        if (type === "news") {
          router.push({
            pathname: "/Detail/NewsDetail",
            params: { ...item },
          });
        } else if (type === "best") {
          router.push({
            pathname: "/Detail/OfferDetail",
            params: { ...item },
          });
        } else if (type === "analysis") {
          router.push({
            pathname: "/Detail/AnalysisDetail",
            params: { ...item },
          });
        }
      }}
    >
      <Image
        source={
          item.image_url
            ? {
                uri: `${URL_BASE}/static/${categoryPath}/${item.image_url
                  .split("/")
                  .pop()}`,
              }
            : require("../../assets/images/image/BARLEY.png")
        }
        style={styles.carouselImage}
      />
      <Text style={styles.carouselTitle}>{item.title}</Text>
      <Text style={styles.newsDate}>{item.date}</Text>
    </TouchableOpacity>
  );

  const renderQuoteItem = ({ item }) => (
    <View style={styles.quoteItem}>
      <Text style={styles.quoteSymbol}>{item.key}</Text>
      <Text style={styles.quotePrice}>{item.value}</Text>
    </View>
  );

  const renderSection = (data, type, categoryPath) => (
    <View>
      <FlatList
        data={data}
        renderItem={({ item }) => renderCarouselItem({ item, type, categoryPath })}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselContainer}
      />
    </View>
  );

  return (
    <FlatList
      data={[1]}
      renderItem={() => (
        <>
          <Image
            source={require("../../assets/images/Dobavit-zagolovok.png")}
            style={styles.header}
          />
          <FlatList
            data={quotes}
            renderItem={renderQuoteItem}
            keyExtractor={(item) => item.key}
            numColumns={3}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.offerButton}
              onPress={() => router.push("/Offers")}
            >
              <Text style={styles.buttonText}>Offers</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.requestButton}
              onPress={() => router.push("/Requests")}
            >
              <Text style={styles.buttonText}>Requests</Text>
            </TouchableOpacity>
            {isAdminUser && (
              <TouchableOpacity
                style={styles.adminButton}
                onPress={() => router.push("/Detail/AdminPanel")}
              >
                <Text style={styles.buttonText}>Admin</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.sectionTitle}>Лучшие предложения</Text>
          {renderSection(offers, "best", "image")}

          <Text style={styles.sectionTitle}>Новости</Text>
          {renderSection(internalNews, "news", "news_image")}

          <Text style={styles.sectionTitle}>Рыночный анализ</Text>
          {renderSection(externalAnalyzis, "analysis", "analysis_image")}
        </>
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8f2e9",
    padding: 10,
  },
  header: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    alignSelf: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  offerButton: {
    flex: 1,
    backgroundColor: "#4caf50",
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: "center",
  },
  requestButton: {
    flex: 1,
    backgroundColor: "#ff9800",
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: "center",
  },
  adminButton: {
    flex: 1,
    backgroundColor: "#ff5722",
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    marginHorizontal: 20,
    color: "#2e7d32",
  },
  quoteItem: {
    flex: 1,
    borderBottomColor: "#4caf56",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    marginVertical: 2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  quoteSymbol: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  quotePrice: {
    fontSize: 14,
    color: "#4caf50",
    fontWeight: "bold",
  },
  carouselContainer: {
    paddingHorizontal: 10,
  },
  carouselItem: {
    width: 300,  // фиксированная ширина
    marginHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  carouselImage: {
    width: 280,
    height: 250,
    borderRadius: 10,
  },
  carouselTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  newsDate: {
    fontSize: 12,
    color: "#aaa",
  },
});


// return (
//   <View style={styles.modalContent}>
//     <ScrollView nestedScrollEnabled={true}>
//       <Text style={styles.modalHeader}>Добавить</Text>
//       {Object.keys(config.state).map((field) =>
//         field !== "image_url" &&
//         field !== "author" &&
//         field !== "second_tag" ? (
//           <TextInput
//             key={field}
//             style={styles.input}
//             placeholder={field}
//             value={config.state[field]}
//             onChangeText={(text) =>
//               config.setState((prevState) => ({
//                 ...prevState,
//                 [field]: text,
//               }))
//             }
//             keyboardType={field === "price" ? "numeric" : "default"}
//           />
//         ) : null
//       )}

//       {/* Дополнительные рендеры (автор и категория) */}
//       {/* {config.additionalRender ? config.additionalRender() : null} */}

//       <View style={styles.imagePickerWrapper}>
//         {config.additionalRender ? (
//           config.additionalRender()
//         ) : (
//           <Text>Нет доступных изображений</Text>
//         )}
//       </View>

//       {config.state.image_url ? (
//         <Image
//           source={{ uri: config.state.image_url }}
//           style={styles.previewImage}
//         />
//       ) : null}
//       <TouchableOpacity
//         style={styles.button}
//         onPress={() =>
//           handleAdd(config.state, config.endpoint, config.reset)
//         }
//       >
//         <Text style={styles.buttonText}>Добавить</Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={styles.backButton}
//         onPress={() => setModalVisible(null)}
//       >
//         <Text style={styles.buttonText}>Назад</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   </View>
// );
