import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ImageStyle } from 'react-native';
import { Card, CardContent } from './ui/Card';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

interface CropDetailCardProps {
  cropName: string;
  quantity: string;
  price: string;
  location: string;
  quality: string;
  moisture?: string;
  protein?: string;
  gluten?: string;
  imageUrl?: string;
  defaultImage: any;
  onPress: () => void;
}

export const CropDetailCard: React.FC<CropDetailCardProps> = ({
  cropName,
  quantity,
  price,
  location,
  quality,
  moisture,
  protein,
  gluten,
  imageUrl,
  defaultImage,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Card>
        <CardContent>
          <View style={styles.header}>
            <Image
              source={imageUrl ? { uri: imageUrl } : defaultImage}
              style={styles.image as ImageStyle}
            />
            <View style={styles.headerContent}>
              <Text style={styles.title} numberOfLines={2}>
                {cropName}
              </Text>
              <View style={styles.locationContainer}>
                <Ionicons name="location-outline" size={16} color={theme.colors.textSecondary} />
                <Text style={styles.location}>{location}</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Ionicons name="cube-outline" size={20} color={theme.colors.primary} />
              <Text style={styles.detailLabel}>Количество</Text>
              <Text style={styles.detailValue}>{quantity}</Text>
            </View>

            <View style={styles.detailItem}>
              <Ionicons name="pricetag-outline" size={20} color={theme.colors.primary} />
              <Text style={styles.detailLabel}>Цена</Text>
              <Text style={styles.detailValue}>{price}</Text>
            </View>

            <View style={styles.detailItem}>
              <Ionicons name="star-outline" size={20} color={theme.colors.primary} />
              <Text style={styles.detailLabel}>Качество</Text>
              <Text style={styles.detailValue}>{quality}</Text>
            </View>

            {moisture && (
              <View style={styles.detailItem}>
                <Ionicons name="water-outline" size={20} color={theme.colors.primary} />
                <Text style={styles.detailLabel}>Влажность</Text>
                <Text style={styles.detailValue}>{moisture}</Text>
              </View>
            )}

            {protein && (
              <View style={styles.detailItem}>
                <Ionicons name="nutrition-outline" size={20} color={theme.colors.primary} />
                <Text style={styles.detailLabel}>Протеин</Text>
                <Text style={styles.detailValue}>{protein}</Text>
              </View>
            )}

            {gluten && (
              <View style={styles.detailItem}>
                <Ionicons name="leaf-outline" size={20} color={theme.colors.primary} />
                <Text style={styles.detailLabel}>Клейковина</Text>
                <Text style={styles.detailValue}>{gluten}</Text>
              </View>
            )}
          </View>

          <View style={styles.footer}>
            <Text style={styles.viewMore}>Подробнее</Text>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.primary} />
          </View>
        </CardContent>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  headerContent: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.lg,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  location: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.backgroundSecondary,
    marginVertical: theme.spacing.md,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  detailItem: {
    width: '47%',
    backgroundColor: theme.colors.backgroundSecondary,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  detailLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  detailValue: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.md,
  },
  viewMore: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: '600',
    marginRight: theme.spacing.xs,
  },
}); 