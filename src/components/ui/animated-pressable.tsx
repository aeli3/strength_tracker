import type { ReactNode } from 'react';
import { useState } from 'react';
import {
  Animated,
  Pressable,
  type GestureResponderEvent,
  type PressableProps,
  type PressableStateCallbackType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

interface AnimatedPressableProps extends Omit<PressableProps, 'children' | 'style'> {
  children: ReactNode;
  pressedOpacity?: number;
  pressedScale?: number;
  style?: StyleProp<ViewStyle> | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>);
}

export function AnimatedPressable({
  children,
  onPressIn,
  onPressOut,
  pressedOpacity = 0.86,
  pressedScale = 0.98,
  style,
  ...props
}: AnimatedPressableProps) {
  const [pressProgress] = useState(() => new Animated.Value(0));

  const animatedStyle = {
    opacity: pressProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [1, pressedOpacity],
    }),
    transform: [
      {
        scale: pressProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [1, pressedScale],
        }),
      },
    ],
  };

  function handlePressIn(event: GestureResponderEvent) {
    Animated.timing(pressProgress, {
      toValue: 1,
      duration: 110,
      useNativeDriver: true,
    }).start();
    onPressIn?.(event);
  }

  function handlePressOut(event: GestureResponderEvent) {
    Animated.timing(pressProgress, {
      toValue: 0,
      duration: 170,
      useNativeDriver: true,
    }).start();
    onPressOut?.(event);
  }

  return (
    <Animated.View style={animatedStyle}>
      <Pressable {...props} onPressIn={handlePressIn} onPressOut={handlePressOut} style={style}>
        {children}
      </Pressable>
    </Animated.View>
  );
}
