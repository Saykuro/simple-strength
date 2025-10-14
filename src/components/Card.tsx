import type React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});

export default Card;
