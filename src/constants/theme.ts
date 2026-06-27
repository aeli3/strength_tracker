/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F3F8FF',
    backgroundSelected: '#D9EAFF',
    textSecondary: '#527092',
    accent: '#007AFF',
    accentText: '#ffffff',
    switchTrackOff: '#D9EAFF',
    switchThumb: '#ffffff',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#111111',
    backgroundSelected: '#222222',
    textSecondary: '#B8B8B8',
    accent: '#ffffff',
    accentText: '#000000',
    switchTrackOff: '#222222',
    switchThumb: '#ffffff',
  },
} as const;

export const ExerciseIconColors = {
  light: [
    { background: '#DDEEFF', text: '#0064D8' },
    { background: '#E7F3FF', text: '#0A74D9' },
    { background: '#DFF6FF', text: '#087EA4' },
    { background: '#EAF0FF', text: '#315FD1' },
    { background: '#E5F7FF', text: '#006C9A' },
  ],
  dark: [
    { background: '#202020', text: '#ffffff' },
    { background: '#1B1B1B', text: '#ffffff' },
    { background: '#252525', text: '#ffffff' },
    { background: '#181818', text: '#ffffff' },
    { background: '#222222', text: '#ffffff' },
  ],
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'OpenSans_500Medium',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    rounded: 'OpenSans_700Bold',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'OpenSans_500Medium',
    serif: 'serif',
    rounded: 'OpenSans_700Bold',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  oneAndHalf: 6,
  two: 8,
  twoAndHalf: 12,
  three: 16,
  four: 24,
  five: 32,
  fiveAndHalf: 48,
  six: 64,
} as const;

export const Typography = {
  eyebrow: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    letterSpacing: 0.2,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 36,
    letterSpacing: 0,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
    letterSpacing: 0,
  },
  body: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
    letterSpacing: 0,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 21,
    letterSpacing: 0,
  },
  smallLabel: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 17,
    letterSpacing: 0,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 15,
    letterSpacing: 0.6,
  },
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
