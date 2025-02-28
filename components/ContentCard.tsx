import React from 'react';
import { StyleSheet, Text, Image, TouchableOpacity, View, ImageStyle } from 'react-native';
import { Card, CardContent } from './ui/Card';
import { theme } from '../constants/theme';

interface ContentCardProps {
  title: string;
  date?: string;
  imageUrl?: string;
  defaultImage?: any;
  onPress?: () => void;
  category?: string;
  description?: string;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  title,
  date,
  imageUrl,
  defaultImage,
  onPress,
  category,
  description,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Card elevation="md">
        <View>
          <Image
            source={imageUrl ? { uri: imageUrl } : defaultImage}
            style={styles.image as ImageStyle}
            resizeMode="cover"
          />
          {category && (
            <View style={styles.categoryContainer}>
              <Text style={styles.category}>{category}</Text>
            </View>
          )}
        </View>
        <CardContent>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          {description && (
            <Text style={styles.description} numberOfLines={2}>
              {description}
            </Text>
          )}
          {date && <Text style={styles.date}>{date}</Text>}
        </CardContent>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 280,
    marginHorizontal: theme.spacing.sm,
    marginVertical: theme.spacing.md,
  },
  image: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
  },
  categoryContainer: {
    position: 'absolute',
    top: theme.spacing.sm,
    left: theme.spacing.sm,
    backgroundColor: theme.colors.primary.main,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  category: {
    ...theme.typography.caption,
    color: theme.colors.primary.contrast,
    fontWeight: '600',
  },
  title: {
    ...theme.typography.h4,
    marginBottom: theme.spacing.xs,
  },
  description: {
    ...theme.typography.body2,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  date: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
  },
}); 