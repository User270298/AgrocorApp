import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import * as Device from "expo-device";
import { Ionicons } from '@expo/vector-icons';
import { QuoteCard } from "../../components/QuoteCard";
import { ContentCard } from "../../components/ContentCard";
import { Button } from "../../components/ui/Button";
import { theme } from "../../constants/theme";

const URL_BASE = "http://192.168.1.103:8000";
const adminDeviceId = "TP1A.220624.014";

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
    const displayValue = `${value?.current_price || value} ${unitMapping[newKey] || ""}`.trim();
    const trend = value?.trend || 'neutral';
    const change = value?.change ? `${value.change > 0 ? '+' : ''}${value.change}%` : undefined;
    
    return {
      key: newKey,
      value: displayValue,
      trend,
      change,
    };
  });
};

export default function MainScreen() {
  const router = useRouter();
  const [offers, setOffers] = useState([]);
  const [internalNews, setInternalNews] = useState([]);
  const [externalAnalyzis, setExternalAnalyzis] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchQuotes(),
        fetchNews(),
        fetchOffers(),
        fetchAnalysis(),
      ]);
    } catch (error) {
      console.error("Error loading data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

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
        await fetchData();
      } catch (error) {
        console.error("Error loading data:", error.message);
      }
    };

    loadData();

    const interval = setInterval(fetchData, 60 * 60 * 1000); // Обновление данных каждый час
    return () => clearInterval(interval);
  }, []);

  const renderSection = (title, data, type, categoryPath) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity onPress={() => router.push(`/${type}`)}>
          <Text style={styles.seeAll}>Смотреть все</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {data.map((item, index) => (
          <ContentCard
            key={index}
            title={item.title}
            date={item.date}
            imageUrl={
              item.image_url
                ? `${URL_BASE}/static/${categoryPath}/${item.image_url.split("/").pop()}`
                : undefined
            }
            defaultImage={require("../../assets/images/image/BARLEY.png")}
            category={type === 'analysis' ? 'Анализ' : type === 'news' ? 'Новости' : 'Предложение'}
            description={item.description}
            onPress={() =>
              router.push({
                pathname: type === 'news' 
                  ? '/Detail/NewsDetail'
                  : type === 'analysis'
                  ? '/Detail/AnalysisDetail'
                  : '/Detail/OfferDetailScreen',
                params: { ...item },
              })
            }
          />
        ))}
      </ScrollView>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Image
        source={require("../../assets/images/Dobavit-zagolovok.png")}
        style={styles.header}
      />

      <View style={styles.quotesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {quotes.map((item) => (
            <QuoteCard
              key={item.key}
              symbol={item.key}
              value={item.value}
              trend={item.trend}
              change={item.change}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          variant="contained"
          size="large"
          fullWidth
          startIcon={<Ionicons name="add-circle-outline" size={24} color={theme.colors.primary.contrast} />}
          onPress={() => router.push("/Offers")}
        >
          Предложения
        </Button>
        <Button
          variant="outlined"
          size="large"
          fullWidth
          startIcon={<Ionicons name="search-outline" size={24} color={theme.colors.primary.main} />}
          onPress={() => router.push("/Requests")}
        >
          Запросы
        </Button>
        {isAdminUser && (
          <Button
            variant="contained"
            color="secondary"
            size="large"
            fullWidth
            startIcon={<Ionicons name="settings-outline" size={24} color={theme.colors.secondary.contrast} />}
            onPress={() => router.push("/Detail/AdminPanel")}
          >
            Админ панель
          </Button>
        )}
      </View>

      {renderSection("Лучшие предложения", offers, "best", "image")}
      {renderSection("Новости", internalNews, "news", "news_image")}
      {renderSection("Рыночный анализ", externalAnalyzis, "analysis", "analysis_image")}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.paper,
  },
  header: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  quotesContainer: {
    marginVertical: theme.spacing.md,
  },
  buttonContainer: {
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
  },
  seeAll: {
    ...theme.typography.body2,
    color: theme.colors.primary.main,
  },
  contentContainer: {
    paddingHorizontal: theme.spacing.sm,
  },
});
