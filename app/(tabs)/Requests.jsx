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
import { CropDetailCard } from "../../components/CropDetailCard";
import { theme } from "../../theme";

const URL_BASE = "http://192.168.1.103:8000";

const fetchRequests = async () => {
  try {
    const response = await axios.get(`${URL_BASE}/requests`);
    return response.data;
  } catch (error) {
    console.error("Error fetching requests:", error);
    throw error;
  }
};

export default function Requests() {
  const [requests, setRequests] = useState([]);
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

  const loadRequests = async () => {
    try {
      const data = await fetchRequests();
      setRequests(data);
    } catch (error) {
      console.error("Error loading requests:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadRequests();
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const filteredRequests =
    selectedCategory === "all"
      ? requests
      : requests.filter((request) => request.second_tag === selectedCategory);

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
        data={filteredRequests}
        renderItem={({ item }) => (
          <CropDetailCard
            cropName={item.crop_name}
            quantity={item.quantity}
            price={item.seller || item.bayer}
            location={item.location || "Не указано"}
            quality={item.quality || "Стандарт"}
            moisture={item.moisture}
            protein={item.protein}
            gluten={item.gluten}
            imageUrl={
              item.image_url
                ? `${URL_BASE}/static/requests/${item.image_url.split("/").pop()}`
                : undefined
            }
            defaultImage={require("../../assets/images/image/BARLEY.png")}
            onPress={() => navigation.push("Detail/RequestDetail", { item })}
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
