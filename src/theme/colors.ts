/**
 * Design System - Color Tokens
 * Based on iOS Dark Mode aesthetics with teal/mint accent colors
 */

export const colors = {
  // Primary brand colors (Teal/Mint from screenshot)
  primary: {
    main: '#5FCDB4', // Teal/mint from cards
    light: '#7DDDC7',
    dark: '#4AB89F',
    contrast: '#FFFFFF',
  },

  // Accent colors
  accent: {
    yellow: '#E8FF6B', // Yellow-green from Yoga card
    orange: '#F4A460', // Orange from Cycling card
    blue: '#0A84FF', // iOS blue
    purple: '#BF5AF2', // iOS purple
  },

  // Background colors (Dark theme)
  background: {
    primary: '#000000', // Main app background
    secondary: '#1C1C1E', // Card background (darkest)
    tertiary: '#2C2C2E', // Elevated card background
    elevated: '#3A3A3C', // Input fields, elevated elements
    overlay: '#48484A', // Highest elevation
  },

  // Text colors
  text: {
    primary: '#FFFFFF',
    secondary: '#8E8E93', // Gray text for subtitles
    tertiary: '#98989D', // Lighter gray for units/labels
    disabled: '#636366',
    inverse: '#000000',
  },

  // Semantic colors
  success: {
    main: '#30D158', // Green for success states
    light: '#32D74B',
    dark: '#30DB5B',
    background: 'rgba(48, 209, 88, 0.15)',
  },

  error: {
    main: '#FF453A', // Red for errors/destructive actions
    light: '#FF6961',
    dark: '#FF3B30',
    background: 'rgba(255, 69, 58, 0.2)',
  },

  warning: {
    main: '#FFD60A',
    light: '#FFD426',
    dark: '#FFC400',
    background: 'rgba(255, 214, 10, 0.15)',
  },

  info: {
    main: '#0A84FF',
    light: '#409CFF',
    dark: '#0071E3',
    background: 'rgba(10, 132, 255, 0.15)',
  },

  // UI Element colors
  border: {
    primary: '#38383A',
    secondary: '#48484A',
    focus: '#5FCDB4',
    error: '#FF453A',
  },

  // Interactive states
  interactive: {
    pressed: 'rgba(255, 255, 255, 0.15)',
    hover: 'rgba(255, 255, 255, 0.08)',
    disabled: 'rgba(255, 255, 255, 0.3)',
  },

  // Overlay & shadows
  overlay: {
    light: 'rgba(0, 0, 0, 0.4)',
    medium: 'rgba(0, 0, 0, 0.6)',
    heavy: 'rgba(0, 0, 0, 0.8)',
  },

  // Special gradients (for activity cards)
  gradients: {
    teal: ['#5FCDB4', '#4AB89F'],
    yellow: ['#E8FF6B', '#D4F055'],
    orange: ['#F4A460', '#E89450'],
    purple: ['#BF5AF2', '#9F4FD9'],
  },
} as const;

export type Colors = typeof colors;
