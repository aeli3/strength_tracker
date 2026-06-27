import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider as RouterThemeProvider } from 'expo-router';
import * as SystemUI from 'expo-system-ui';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type ThemePreference = 'system' | 'light' | 'dark';
type ResolvedTheme = 'light' | 'dark';

interface AppThemeContextValue {
  colors: (typeof Colors)[ResolvedTheme];
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
}

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

export function AppThemeProvider({ children }: PropsWithChildren) {
  const systemScheme = useColorScheme();
  const [preference, setPreference] = useState<ThemePreference>('system');

  const resolvedTheme: ResolvedTheme =
    preference === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : preference;
  const colors = Colors[resolvedTheme];

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(colors.background);
  }, [colors.background]);

  const value = useMemo(
    () => ({ colors, preference, resolvedTheme, setPreference }),
    [colors, preference, resolvedTheme],
  );

  return (
    <AppThemeContext.Provider value={value}>
      <RouterThemeProvider value={resolvedTheme === 'dark' ? DarkTheme : DefaultTheme}>
        {children}
      </RouterThemeProvider>
    </AppThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(AppThemeContext);

  if (!context) {
    throw new Error('useAppTheme must be used inside AppThemeProvider');
  }

  return context;
}
