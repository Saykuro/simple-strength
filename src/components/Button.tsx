import type React from 'react';
import { Pressable, StyleSheet, Text, type TextStyle, type ViewStyle } from 'react-native';
import { colors, typography, borderRadius, layout } from '../theme';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
}) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        styles[size],
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, styles[`${variant}Text`], styles[`${size}Text`], textStyle]}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Variants
  primary: {
    backgroundColor: colors.primary.main,
  },
  secondary: {
    backgroundColor: colors.background.tertiary,
  },
  danger: {
    backgroundColor: colors.error.main,
  },

  // Sizes
  small: {
    paddingVertical: layout.buttonPadding.small.vertical,
    paddingHorizontal: layout.buttonPadding.small.horizontal,
  },
  medium: {
    paddingVertical: layout.buttonPadding.medium.vertical,
    paddingHorizontal: layout.buttonPadding.medium.horizontal,
  },
  large: {
    paddingVertical: layout.buttonPadding.large.vertical,
    paddingHorizontal: layout.buttonPadding.large.horizontal,
  },

  // Text styles
  text: {
    fontWeight: typography.fontWeight.semibold,
  },
  primaryText: {
    color: colors.text.inverse,
  },
  secondaryText: {
    color: colors.info.main,
  },
  dangerText: {
    color: colors.text.primary,
  },

  // Size-specific text styles
  smallText: {
    fontSize: typography.fontSize.base,
  },
  mediumText: {
    fontSize: typography.fontSize.lg,
  },
  largeText: {
    fontSize: typography.fontSize.xl,
  },

  // States
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.3,
  },
});

export default Button;
