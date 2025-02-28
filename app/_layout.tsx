import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const CustomDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: '#1e1e1e', // Custom background color
      text: '#ffffff', // Custom text color
      primary: '#ff5722', // Primary color
    },
  };

  const CustomLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#ffffff', // Custom background color
      text: '#000000', // Custom text color
      primary: '#4caf50', // Primary color
    },
  };

  return (
    <ThemeProvider value={colorScheme === 'dark' ? CustomDarkTheme : CustomLightTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Corrected path for the NewsDetail route */}
        <Stack.Screen name="Detail/NewsDetail" options={{ title: "Новости", headerTitleAlign: 'center', }} />
        <Stack.Screen name="Detail/AnalysisDetail" options={{ title: "Подробный анализ", headerTitleAlign: 'center', }} />
        <Stack.Screen name="Detail/OfferDetail" options={{ title: "Подробнее об акции", headerTitleAlign: 'center', }} />
        <Stack.Screen name="Detail/OfferDetailScreen" options={{ title: 'Детали' }} />
        <Stack.Screen name="Detail/VesselDetail" options={{ title: 'Подробнее' }} />
      </Stack>
    </ThemeProvider>
  );
}
