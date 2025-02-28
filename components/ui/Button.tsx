import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { theme } from '../../constants/theme';

export type ButtonVariant = 'contained' | 'outlined' | 'text';
export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonColor = 'primary' | 'secondary' | 'error' | 'success' | 'warning';

interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: ButtonColor;
  loading?: boolean;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  textStyle?: TextStyle;
  containerStyle?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'contained',
  size = 'medium',
  color = 'primary',
  loading = false,
  fullWidth = false,
  startIcon,
  endIcon,
  disabled,
  children,
  style,
  textStyle,
  containerStyle,
  ...props
}) => {
  const getBackgroundColor = () => {
    if (disabled) return theme.colors.grey[300];
    if (variant === 'contained') return theme.colors[color].main;
    return 'transparent';
  };

  const getBorderColor = () => {
    if (disabled) return theme.colors.grey[300];
    if (variant === 'outlined') return theme.colors[color].main;
    return 'transparent';
  };

  const getTextColor = () => {
    if (disabled) return theme.colors.grey[500];
    if (variant === 'contained') return theme.colors[color].contrast;
    return theme.colors[color].main;
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return theme.spacing.sm;
      case 'large':
        return theme.spacing.lg;
      default:
        return theme.spacing.md;
    }
  };

  const buttonStyle = {
    backgroundColor: getBackgroundColor(),
    borderColor: getBorderColor(),
    padding: getPadding(),
    opacity: disabled ? 0.6 : 1,
    width: fullWidth ? '100%' : undefined,
    ...containerStyle,
  };

  const textStyleBase = {
    color: getTextColor(),
    ...theme.typography.button,
    ...textStyle,
  };

  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle, style]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <>
          {startIcon}
          <Text style={[styles.text, textStyleBase]}>{children}</Text>
          {endIcon}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    gap: theme.spacing.sm,
  },
  text: {
    textAlign: 'center',
  },
}); 