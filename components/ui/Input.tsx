import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { theme } from '../../constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helper?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onEndIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helper,
  startIcon,
  endIcon,
  onEndIconPress,
  containerStyle,
  inputStyle,
  labelStyle,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  const getBorderColor = () => {
    if (error) return theme.colors.error.main;
    if (isFocused) return theme.colors.primary.main;
    return theme.colors.grey[300];
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: error
                ? theme.colors.error.main
                : isFocused
                ? theme.colors.primary.main
                : theme.colors.text.primary,
            },
            labelStyle,
          ]}
        >
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: getBorderColor(),
          },
          style,
        ]}
      >
        {startIcon && <View style={styles.iconContainer}>{startIcon}</View>}
        <TextInput
          style={[
            styles.input,
            {
              color: error ? theme.colors.error.main : theme.colors.text.primary,
            },
            inputStyle,
          ]}
          placeholderTextColor={theme.colors.text.disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {endIcon && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={onEndIconPress}
            disabled={!onEndIconPress}
          >
            {endIcon}
          </TouchableOpacity>
        )}
      </View>
      {(error || helper) && (
        <Text
          style={[
            styles.helperText,
            {
              color: error ? theme.colors.error.main : theme.colors.text.secondary,
            },
          ]}
        >
          {error || helper}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: theme.spacing.xs,
  },
  label: {
    ...theme.typography.body2,
    marginBottom: theme.spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.default,
    minHeight: 48,
  },
  input: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    ...theme.typography.body1,
  },
  iconContainer: {
    paddingHorizontal: theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helperText: {
    ...theme.typography.caption,
    marginTop: theme.spacing.xs,
  },
}); 