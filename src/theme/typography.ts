/**
 * Design System - Typography Tokens
 * Based on iOS San Francisco font system
 */

export const typography = {
  // Font families
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },

  // Font weights
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },

  // Font sizes - iOS inspired scale
  fontSize: {
    xs: 12,
    sm: 13,
    base: 15,
    md: 16,
    lg: 17,
    xl: 19,
    '2xl': 20,
    '3xl': 22,
    '4xl': 28,
    '5xl': 34,
    '6xl': 40,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },

  // Text styles - ready-to-use combinations
  styles: {
    // Large titles
    largeTitle: {
      fontSize: 34,
      fontWeight: '700' as const,
      lineHeight: 41,
      letterSpacing: 0.37,
    },

    // Titles
    title1: {
      fontSize: 28,
      fontWeight: '700' as const,
      lineHeight: 34,
      letterSpacing: 0.36,
    },
    title2: {
      fontSize: 22,
      fontWeight: '700' as const,
      lineHeight: 28,
      letterSpacing: 0.35,
    },
    title3: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 25,
      letterSpacing: 0.38,
    },

    // Headlines
    headline: {
      fontSize: 17,
      fontWeight: '600' as const,
      lineHeight: 22,
      letterSpacing: -0.41,
    },

    // Body text
    body: {
      fontSize: 17,
      fontWeight: '400' as const,
      lineHeight: 22,
      letterSpacing: -0.41,
    },
    bodyEmphasized: {
      fontSize: 17,
      fontWeight: '600' as const,
      lineHeight: 22,
      letterSpacing: -0.41,
    },

    // Callout
    callout: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 21,
      letterSpacing: -0.32,
    },
    calloutEmphasized: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 21,
      letterSpacing: -0.32,
    },

    // Subheadline
    subheadline: {
      fontSize: 15,
      fontWeight: '400' as const,
      lineHeight: 20,
      letterSpacing: -0.24,
    },
    subheadlineEmphasized: {
      fontSize: 15,
      fontWeight: '600' as const,
      lineHeight: 20,
      letterSpacing: -0.24,
    },

    // Footnote
    footnote: {
      fontSize: 13,
      fontWeight: '400' as const,
      lineHeight: 18,
      letterSpacing: -0.08,
    },
    footnoteEmphasized: {
      fontSize: 13,
      fontWeight: '600' as const,
      lineHeight: 18,
      letterSpacing: -0.08,
    },

    // Caption
    caption1: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16,
      letterSpacing: 0,
    },
    caption1Emphasized: {
      fontSize: 12,
      fontWeight: '600' as const,
      lineHeight: 16,
      letterSpacing: 0,
    },
    caption2: {
      fontSize: 11,
      fontWeight: '400' as const,
      lineHeight: 13,
      letterSpacing: 0.06,
    },
    caption2Emphasized: {
      fontSize: 11,
      fontWeight: '600' as const,
      lineHeight: 13,
      letterSpacing: 0.06,
    },
  },
} as const;

export type Typography = typeof typography;
