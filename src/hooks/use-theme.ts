import { useAppTheme } from '@/providers/theme-provider';

export function useTheme() {
  return useAppTheme().colors;
}

export function useThemePreference() {
  const { preference, resolvedTheme, setPreference } = useAppTheme();

  return { preference, resolvedTheme, setPreference };
}
