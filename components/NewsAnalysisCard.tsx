import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ImageStyle, ViewStyle, TextStyle } from 'react-native';
import { Card, CardContent } from './ui/Card';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

interface NewsAnalysisCardProps {
  type: 'news' | 'analysis';
  title: string;
  description: string;
  date: string;
  author?: string;
  imageUrl?: string;
  defaultImage: any;
  onPress: () => void;
}

export const NewsAnalysisCard: React.FC<NewsAnalysisCardProps> = ({
  type,
  title,
  description,
  date,
  author,
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
            <View style={styles.typeContainer}>
              <Ionicons 
                name={type === 'news' ? 'newspaper-outline' : 'analytics-outline'} 
                size={16} 
                color={theme.colors.primary} 
              />
              <Text style={styles.type as TextStyle}>
                {type === 'news' ? 'Новость' : 'Анализ'}
              </Text>
            </View>

            <Text style={styles.title as TextStyle} numberOfLines={2}>
              {title}
            </Text>

            <Text style={styles.description as TextStyle} numberOfLines={3}>
              {description}
            </Text>

            <View style={styles.footer}>
              <View style={styles.footerLeft}>
                <Text style={styles.date as TextStyle}>{date}</Text>
                {author && (
                  <>
                    <View style={styles.dot} />
                    <Text style={styles.author as TextStyle}>{author}</Text>
                  </>
                )}
              </View>
              
              <View style={styles.readMore}>
                <Text style={styles.readMoreText as TextStyle}>Читать далее</Text>
                <Ionicons 
                  name="chevron-forward" 
                  size={16} 
                  color={theme.colors.primary} 
                />
              </View>
            </View>
          </View>
        </CardContent>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  } as ViewStyle,
  image: {
    width: '100%',
    height: 200,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
  } as ImageStyle,
  content: {
    gap: theme.spacing.sm,
  } as ViewStyle,
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  } as ViewStyle,
  type: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: '600',
  } as TextStyle,
  title: {
    ...theme.typography.h2,
    color: theme.colors.text,
  } as TextStyle,
  description: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  } as TextStyle,
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  } as ViewStyle,
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  } as ViewStyle,
  date: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  } as TextStyle,
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.textSecondary,
  } as ViewStyle,
  author: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  } as TextStyle,
  readMore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  } as ViewStyle,
  readMoreText: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: '600',
  } as TextStyle,
}); 