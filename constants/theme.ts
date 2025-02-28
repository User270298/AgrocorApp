export const colors = {
  primary: {
    main: '#2563EB',
    light: '#60A5FA',
    dark: '#1E40AF',
    contrast: '#FFFFFF',
  },
  secondary: {
    main: '#4F46E5',
    light: '#818CF8',
    dark: '#3730A3',
    contrast: '#FFFFFF',
  },
  background: {
    default: '#FFFFFF',
    paper: '#F3F4F6',
    dark: '#111827',
  },
  text: {
    primary: '#111827',
    secondary: '#4B5563',
    disabled: '#9CA3AF',
    inverse: '#FFFFFF',
  },
  error: {
    main: '#DC2626',
    light: '#EF4444',
    dark: '#B91C1C',
  },
  success: {
    main: '#059669',
    light: '#10B981',
    dark: '#047857',
  },
  warning: {
    main: '#D97706',
    light: '#F59E0B',
    dark: '#B45309',
  },
  info: {
    main: '#2563EB',
    light: '#3B82F6',
    dark: '#1D4ED8',
  },
  grey: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
};

export const typography = {
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
  },
  h3: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
  },
  h4: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
  },
  body1: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  body2: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  },
  button: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
}; 