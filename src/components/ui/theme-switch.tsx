import { Switch } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

interface ThemeSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export function ThemeSwitch({ value, onValueChange }: ThemeSwitchProps) {
  const colors = useTheme();

  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: colors.switchTrackOff, true: colors.accent }}
      thumbColor={colors.switchThumb}
      ios_backgroundColor={colors.switchTrackOff}
    />
  );
}
