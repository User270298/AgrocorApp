import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ImageStyle } from 'react-native';
import { Card, CardContent } from './ui/Card';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

interface OfferCardProps {
  title: string;
  quantity: string;
  price: string;
  imageUrl?: string;
  defaultImage: any;
  onPress: () => void;
}

export const OfferCard: React.FC<OfferCardProps> = ({
  title,
  quantity,
  price,
  imageUrl,
  defaultImage,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Card>
        <CardContent>
          <Image
            source={imageUrl ? { uri: imageUrl } : defaultImage}
            style={styles.image as ImageStyle}
          />
          
          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>

            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Ionicons name="cube-outline" size={16} color={theme.colors.textSecondary} />
                <Text style={styles.detailText}>{quantity}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Ionicons name="pricetag-outline" size={16} color={theme.colors.textSecondary} />
                <Text style={styles.detailText}>{price}</Text>
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={styles.viewMore}>Подробнее</Text>
              <Ionicons 
                name="chevron-forward" 
                size={16} 
                color={theme.colors.primary} 
              />
            </View>
          </View>
        </CardContent>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    marginBottom: theme.spacing.md,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.sm,
  },
  content: {
    gap: theme.spacing.sm,
  },
  title: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text,
  },
  detailsContainer: {
    gap: theme.spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  detailText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.xs,
  },
  viewMore: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: '600',
    marginRight: theme.spacing.xs,
  },
}); 