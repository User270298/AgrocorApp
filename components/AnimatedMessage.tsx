import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { Card } from './ui/Card';
import { theme } from '../constants/theme';

interface AnimatedMessageProps {
  children: React.ReactNode;
  sender: 'user' | 'bot';
  isNew?: boolean;
  status?: 'sent' | 'pending' | 'error';
  timestamp?: number;
}

export const AnimatedMessage: React.FC<AnimatedMessageProps> = ({
  children,
  sender,
  isNew = false,
  status = 'sent',
  timestamp,
}) => {
  const translateY = useSharedValue(50);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    if (isNew) {
      translateY.value = 50;
      opacity.value = 0;
      scale.value = 0.8;

      translateY.value = withSpring(0, {
        damping: 15,
        stiffness: 150,
      });
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 150,
      });
    } else {
      translateY.value = 0;
      opacity.value = 1;
      scale.value = 1;
    }
  }, [isNew]);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      scale.value,
      [0.8, 1],
      [sender === 'user' ? 50 : -50, 0]
    );

    return {
      opacity: opacity.value,
      transform: [
        { translateY: translateY.value },
        { scale: scale.value },
        { translateX },
      ],
    };
  });

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <Ionicons name="time" size={16} color={theme.colors.warning.main} />;
      case 'error':
        return <Ionicons name="alert-circle" size={16} color={theme.colors.error.main} />;
      case 'sent':
        return <Ionicons name="checkmark-done" size={16} color={theme.colors.success.main} />;
      default:
        return null;
    }
  };

  const formatTime = (timestamp?: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Animated.View style={[
      styles.container,
      sender === 'user' ? styles.userContainer : styles.botContainer,
      animatedStyle,
    ]}>
      <Card
        style={[styles.card]}
        elevation={sender === 'bot' ? 'sm' : 'none'}
        backgroundColor={
          sender === 'user'
            ? theme.colors.primary.light
            : theme.colors.background.default
        }
      >
        <Card.Content>
          {children}
          <View style={styles.footer}>
            {timestamp && (
              <Text style={[
                styles.timestamp,
                { color: sender === 'user' ? theme.colors.primary.contrast : theme.colors.text.secondary },
              ]}>
                {formatTime(timestamp)}
              </Text>
            )}
            {sender === 'user' && getStatusIcon()}
          </View>
        </Card.Content>
      </Card>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    marginVertical: theme.spacing.xs,
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  botContainer: {
    alignSelf: 'flex-start',
  },
  card: {
    borderRadius: theme.borderRadius.lg,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.xs,
    gap: theme.spacing.xs,
  },
  timestamp: {
    ...theme.typography.caption,
  },
}); 