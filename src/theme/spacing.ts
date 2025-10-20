/**
 * Design System - Spacing & Layout Tokens
 * 8px base grid system
 */

export const spacing = {
  // Base spacing scale (8px grid)
  0: 0,
  1: 4, // 0.5 unit
  2: 8, // 1 unit
  3: 12, // 1.5 units
  4: 16, // 2 units
  5: 20, // 2.5 units
  6: 24, // 3 units
  7: 28, // 3.5 units
  8: 32, // 4 units
  10: 40, // 5 units
  12: 48, // 6 units
  16: 64, // 8 units
  20: 80, // 10 units
  24: 96, // 12 units
} as const;

// Semantic spacing tokens
export const layout = {
  // Container padding
  containerPadding: {
    horizontal: 16,
    vertical: 16,
  },

  // Screen padding
  screenPadding: {
    horizontal: 16,
    vertical: 24,
  },

  // Card spacing
  cardPadding: 16,
  cardMargin: {
    vertical: 6,
    horizontal: 16,
  },
  cardGap: 12,

  // Section spacing
  sectionGap: 24,
  sectionPadding: 16,

  // Component spacing
  componentGap: 8,
  elementGap: 4,

  // Input spacing
  inputPadding: {
    vertical: 14,
    horizontal: 16,
  },

  // Button spacing
  buttonPadding: {
    small: {
      vertical: 10,
      horizontal: 18,
    },
    medium: {
      vertical: 16,
      horizontal: 24,
    },
    large: {
      vertical: 18,
      horizontal: 32,
    },
  },
} as const;

// Border radius tokens
export const borderRadius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 10,
  lg: 12,
  xl: 14,
  '2xl': 16,
  '3xl': 20,
  '4xl': 24,
  full: 9999,
} as const;

// Size tokens for common UI elements
export const sizes = {
  // Icon sizes
  icon: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
  },

  // Avatar/badge sizes
  badge: {
    sm: 32,
    md: 40,
    lg: 56,
    xl: 72,
  },

  // Touch target minimums
  touchTarget: {
    min: 44,
    comfortable: 48,
  },

  // Button heights
  button: {
    small: 36,
    medium: 48,
    large: 56,
  },

  // Input heights
  input: {
    small: 36,
    medium: 44,
    large: 52,
  },
} as const;

// Shadow tokens (iOS inspired)
export const shadows = {
  none: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.0,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.23,
    shadowRadius: 4.65,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 7.49,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.27,
    shadowRadius: 13.16,
    elevation: 10,
  },
} as const;

export type Spacing = typeof spacing;
export type Layout = typeof layout;
export type BorderRadius = typeof borderRadius;
export type Sizes = typeof sizes;
export type Shadows = typeof shadows;
