import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { CategorySelector } from "../../components/CategorySelector";
import { OfferCard } from "../../components/OfferCard";
import { theme } from "../../theme";
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
  const [refreshing, setRefreshing] = useState(false);
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

  const loadOffers = async () => {
    try {
      const data = await fetchOffers();
      setOffers(data);
    } catch (error) {
      console.error("Error loading offers:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadOffers();
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const filteredOffers =
    selectedCategory === "all"
      ? offers
      : offers.filter((offer) => offer.second_tag === selectedCategory);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <CategorySelector
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        }
        data={filteredOffers}
        renderItem={({ item }) => (
          <OfferCard
            title={item.crop_name}
            quantity={`Количество: ${item.quantity}`}
            price={`Цена: ${item.seller || item.bayer}`}
            imageUrl={
              item.image_url
                ? `${URL_BASE}/static/image/${item.image_url.split("/").pop()}`
                : undefined
            }
            defaultImage={require("../../assets/images/image/BARLEY.png")}
            onPress={() => navigation.push("Detail/OfferDetailScreen", { item })}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  list: {
    padding: theme.spacing.md,
  },
  row: {
    justifyContent: "space-between",
  },
});
