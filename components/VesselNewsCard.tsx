import React from 'react';
import { StyleSheet, Text, Image, TouchableOpacity, View, ImageStyle } from 'react-native';
import { Card, CardContent } from './ui/Card';
import { theme } from '../theme';

interface VesselNewsCardProps {
  title: string;
  date: string;
  imageUrl?: string;
  defaultImage: any;
  onPress: () => void;
}

export const VesselNewsCard: React.FC<VesselNewsCardProps> = ({
  title,
  date,
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
          <View style={styles.contentContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
            <Text style={styles.date}>{date}</Text>
          </View>
        </CardContent>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 280,
    marginRight: 16,
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: theme.borderRadius.lg,
    marginBottom: 8,
  },
  contentContainer: {
    padding: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
}); 