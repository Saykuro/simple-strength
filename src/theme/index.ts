/**
 * Design System - Main Theme Export
 * Central theme configuration for Simple Strength app
 */

import { colors } from './colors';
import { typography } from './typography';
import { spacing, layout, borderRadius, sizes, shadows } from './spacing';

export const theme = {
  colors,
  typography,
  spacing,
  layout,
  borderRadius,
  sizes,
  shadows,
} as const;

// Re-export individual tokens for convenience
export { colors } from './colors';
export { typography } from './typography';
export { spacing, layout, borderRadius, sizes, shadows } from './spacing';

// Type exports
export type Theme = typeof theme;
export type { Colors } from './colors';
export type { Typography } from './typography';
export type { Spacing, Layout, BorderRadius, Sizes, Shadows } from './spacing';

// Default export
export default theme;
