import {
  OpenSans_500Medium,
  OpenSans_600SemiBold,
  OpenSans_700Bold,
  useFonts,
} from '@expo-google-fonts/open-sans';
import { Stack } from 'expo-router';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AppThemeProvider } from '@/providers/theme-provider';

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    OpenSans_500Medium,
    OpenSans_600SemiBold,
    OpenSans_700Bold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AppThemeProvider>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ animation: 'slide_from_right', animationDuration: 220 }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="exercise/[id]"
          options={{
            headerBackTitle: 'Exercises',
          }}
        />
      </Stack>
    </AppThemeProvider>
  );
}
