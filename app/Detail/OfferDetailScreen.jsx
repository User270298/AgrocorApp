import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Linking,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
// import { URL_BASE } from '@env';
const URL_BASE = "http://192.168.1.103:8000";
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function OfferDetailScreen() {
  const route = useRoute();
  const { params } = route;
  
  if (!params || !params.item) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Нет данных для отображения</Text>
      </View>
    );
  }

  const {
    crop_name,
    quantity,
    port,
    shipment_period,
    seller,
    bayer,
    country,
    author,
    image_url,
    date,
  } = params.item;

  const fullImageUrl = image_url ? `${URL_BASE}${image_url}` : null;

  const formatDate = (dateString) => {
    try {
      if (!dateString) return '';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch (error) {
      console.log('Error formatting date:', error);
      return dateString;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={styles.scrollContent}
      >
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
          <Text style={styles.title}>{crop_name}</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Date Card */}
          <View style={styles.dateCard}>
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <Text style={styles.date}>{formatDate(date)}</Text>
          </View>

          {/* Details Card */}
          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Детали предложения</Text>
            
            <View style={styles.detailRow}>
              <Ionicons name="cube-outline" size={20} color="#2e7d32" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Количество</Text>
                <Text style={styles.detailValue} numberOfLines={3}>{quantity}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="boat-outline" size={20} color="#2e7d32" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Порт</Text>
                <Text style={styles.detailValue} numberOfLines={3}>{port}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={20} color="#2e7d32" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Период поставки</Text>
                <Text style={styles.detailValue} numberOfLines={3}>{shipment_period}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="cash-outline" size={20} color="#2e7d32" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Цена</Text>
                <Text style={styles.detailValue} numberOfLines={3}>{seller || bayer}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="flag-outline" size={20} color="#2e7d32" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Страна</Text>
                <Text style={styles.detailValue} numberOfLines={3}>{country}</Text>
              </View>
            </View>
          </View>

          {/* Contact Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => Linking.openURL(author)}
          >
            <Ionicons name="mail-outline" size={24} color="white" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Связаться</Text>
          </TouchableOpacity>
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  imageContainer: {
    position: 'relative',
    height: SCREEN_HEIGHT * 0.35, // 35% от высоты экрана
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
    minHeight: SCREEN_HEIGHT * 0.65, // Минимум 65% от высоты экрана
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
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
    paddingVertical: 5,
  },
  detailContent: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    flexWrap: 'wrap',
  },
  button: {
    backgroundColor: '#2e7d32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
