import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardContent } from '../../components/ui/Card';
import { theme } from '../../theme';

const DetailRow = ({ icon, label, value }) => (
  <View style={styles.detailRow}>
    <View style={styles.detailLabelContainer}>
      <Ionicons name={icon} size={20} color={theme.colors.primary} />
      <Text style={styles.detailLabel}>{label}</Text>
    </View>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

export default function RequestDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route.params;
  const { width } = useWindowDimensions();

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Image */}
      <View style={styles.imageContainer}>
        <Image
          source={
            item.image_url
              ? { uri: `http://192.168.1.103:8000/static/requests/${item.image_url.split('/').pop()}` }
              : require('../../assets/images/image/BARLEY.png')
          }
          style={[styles.image, { width }]}
          resizeMode="cover"
        />
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.white} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Title Card */}
        <Card style={styles.titleCard}>
          <CardContent>
            <Text style={styles.title}>{item.crop_name}</Text>
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.location}>{item.location || 'Не указано'}</Text>
            </View>
          </CardContent>
        </Card>

        {/* Details Card */}
        <Card style={styles.detailsCard}>
          <CardContent>
            <Text style={styles.sectionTitle}>Характеристики</Text>
            <DetailRow
              icon="cube-outline"
              label="Количество"
              value={item.quantity}
            />
            <DetailRow
              icon="pricetag-outline"
              label="Цена"
              value={item.seller || item.bayer}
            />
            <DetailRow
              icon="star-outline"
              label="Качество"
              value={item.quality || 'Стандарт'}
            />
            {item.moisture && (
              <DetailRow
                icon="water-outline"
                label="Влажность"
                value={item.moisture}
              />
            )}
            {item.protein && (
              <DetailRow
                icon="nutrition-outline"
                label="Протеин"
                value={item.protein}
              />
            )}
            {item.gluten && (
              <DetailRow
                icon="leaf-outline"
                label="Клейковина"
                value={item.gluten}
              />
            )}
          </CardContent>
        </Card>

        {/* Additional Info Card */}
        <Card style={styles.additionalCard}>
          <CardContent>
            <Text style={styles.sectionTitle}>Дополнительная информация</Text>
            <View style={styles.tagsContainer}>
              {item.first_tag && (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{item.first_tag}</Text>
                </View>
              )}
              {item.second_tag && (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{item.second_tag}</Text>
                </View>
              )}
            </View>
            {item.description && (
              <Text style={styles.description}>{item.description}</Text>
            )}
          </CardContent>
        </Card>

        {/* Contact Card */}
        <Card style={styles.contactCard}>
          <CardContent>
            <Text style={styles.sectionTitle}>Контактная информация</Text>
            {item.contact_person && (
              <DetailRow
                icon="person-outline"
                label="Контактное лицо"
                value={item.contact_person}
              />
            )}
            {item.phone && (
              <DetailRow
                icon="call-outline"
                label="Телефон"
                value={item.phone}
              />
            )}
            {item.email && (
              <DetailRow
                icon="mail-outline"
                label="Email"
                value={item.email}
              />
            )}
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    height: 300,
  },
  backButton: {
    position: 'absolute',
    top: 44,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    marginTop: -24,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  titleCard: {
    marginBottom: theme.spacing.sm,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  location: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  sectionTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.backgroundSecondary,
  },
  detailLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  detailLabel: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  detailValue: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  tag: {
    backgroundColor: theme.colors.backgroundSecondary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.lg,
  },
  tagText: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
}); 