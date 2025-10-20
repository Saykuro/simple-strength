import type React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, borderRadius, layout } from '../theme';

export interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: object;
}

const Card: React.FC<CardProps> = ({ children, onPress, style }) => {
  const Component = onPress ? Pressable : View;

  return (
    <Component style={({ pressed }) => [styles.card, onPress && pressed && styles.pressed, style]} onPress={onPress}>
      {children}
    </Component>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: layout.cardPadding,
    marginVertical: layout.cardMargin.vertical,
    marginHorizontal: layout.cardMargin.horizontal,
  },
  pressed: {
    opacity: 0.9,
  },
});

export default Card;
