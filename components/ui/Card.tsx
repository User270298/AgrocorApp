import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  StyleProp,
} from 'react-native';
import { theme } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'outlined' | 'elevated';
  backgroundColor?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  elevation = 'md',
  variant = 'elevated',
  backgroundColor = theme.colors.background.default,
}) => {
  const Container = onPress ? TouchableOpacity : View;

  const cardStyle = [
    styles.card,
    variant === 'outlined' && styles.outlined,
    elevation !== 'none' && variant === 'elevated' && theme.shadows[elevation],
    { backgroundColor },
    style,
  ];

  return (
    <Container style={cardStyle} onPress={onPress}>
      {children}
    </Container>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; style?: StyleProp<ViewStyle> }> = ({
  children,
  style,
}) => (
  <View style={[styles.header, style]}>
    {children}
  </View>
);

export const CardContent: React.FC<{ children: React.ReactNode; style?: StyleProp<ViewStyle> }> = ({
  children,
  style,
}) => (
  <View style={[styles.content, style]}>
    {children}
  </View>
);

export const CardFooter: React.FC<{ children: React.ReactNode; style?: StyleProp<ViewStyle> }> = ({
  children,
  style,
}) => (
  <View style={[styles.footer, style]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  outlined: {
    borderWidth: 1,
    borderColor: theme.colors.grey[200],
  },
  header: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey[200],
  },
  content: {
    padding: theme.spacing.md,
  },
  footer: {
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.grey[200],
  },
}); 