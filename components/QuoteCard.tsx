import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, CardContent } from './ui/Card';
import { theme } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface QuoteCardProps {
  symbol: string;
  value: string;
  trend?: 'up' | 'down' | 'neutral';
  change?: string;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({
  symbol,
  value,
  trend = 'neutral',
  change,
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return theme.colors.success.main;
      case 'down':
        return theme.colors.error.main;
      default:
        return theme.colors.text.secondary;
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <Ionicons name="trending-up" size={20} color={theme.colors.success.main} />;
      case 'down':
        return <Ionicons name="trending-down" size={20} color={theme.colors.error.main} />;
      default:
        return <Ionicons name="remove" size={20} color={theme.colors.text.secondary} />;
    }
  };

  return (
    <Card style={styles.container} elevation="sm">
      <CardContent>
        <View style={styles.header}>
          <Text style={styles.symbol}>{symbol}</Text>
          {getTrendIcon()}
        </View>
        <Text style={styles.value}>{value}</Text>
        {change && (
          <Text style={[styles.change, { color: getTrendColor() }]}>
            {change}
          </Text>
        )}
      </CardContent>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: theme.spacing.xs,
    minWidth: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  symbol: {
    ...theme.typography.body2,
    color: theme.colors.text.secondary,
  },
  value: {
    ...theme.typography.h4,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  change: {
    ...theme.typography.caption,
  },
}); 