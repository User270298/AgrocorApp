import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { ContentCard } from '../../components/ContentCard';
import { theme } from '../../constants/theme';
import cacheService from '../utils/cacheService';

const URL_BASE = "http://192.168.121.164:8000";

export default function ViewAllScreen() {
  const router = useRouter();
  const { title, type, categoryPath } = useLocalSearchParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (forceRefresh = false) => {
    try {
      setLoading(true);
      
      const cacheKey = `${type}_all_data`;
      const fetchFunction = async () => {
        let endpoint = type;
        if (type === 'best') {
          endpoint = 'best';
        } else if (type === 'news') {
          endpoint = 'news';
        } else if (type === 'analysis') {
          endpoint = 'analysis';
        }
        
        console.log(`Fetching data from endpoint: ${URL_BASE}/${endpoint}`);
        const response = await axios.get(`${URL_BASE}/${endpoint}`);
        return response.data;
      };
      
      const result = await cacheService.getWithRefresh(
        cacheKey,
        fetchFunction,
        forceRefresh
      );
      
      if (result) {
        console.log(`Setting data for ${type}, received ${result.length} items`);
        setData(result);
      } else {
        console.log(`No data received for ${type}`);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [type]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData(true); // Принудительное обновление при pull-to-refresh
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <ContentCard
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
      fullWidth
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary.main} />
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary.main]}
            />
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Нет доступных данных</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.paper,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  backButton: {
    padding: theme.spacing.xs,
    marginRight: theme.spacing.sm,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.text.primary,
    flex: 1,
  },
  listContainer: {
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    height: theme.spacing.md,
    backgroundColor: theme.colors.background.paper,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    ...theme.typography.body1,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
}); 