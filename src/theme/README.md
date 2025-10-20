# Simple Strength Design System

Ein einheitliches Design System für die Simple Strength App, basierend auf iOS Dark Mode Ästhetik mit Teal/Mint Akzentfarben.

## Übersicht

Das Design System besteht aus vier Hauptkategorien von Design Tokens:

- **Colors** - Farben für UI-Elemente, Text, Backgrounds und semantische States
- **Typography** - Schriftgrößen, -gewichte und vordefinierte Textstile
- **Spacing** - Abstände, Layouts, Border Radius und Größen
- **Shadows** - Schatteneffekte für Elevation (iOS-inspiriert)

## Installation & Verwendung

```typescript
import { colors, typography, spacing, borderRadius } from '../theme';

// Oder einzelne Imports
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
```

## Colors

### Primary Brand Colors (Teal/Mint)

```typescript
colors.primary.main     // #5FCDB4 - Haupt-Teal
colors.primary.light    // #7DDDC7 - Helleres Teal
colors.primary.dark     // #4AB89F - Dunkleres Teal
colors.primary.contrast // #FFFFFF - Kontrast-Text
```

### Accent Colors

```typescript
colors.accent.yellow  // #E8FF6B - Gelb-Grün
colors.accent.orange  // #F4A460 - Orange
colors.accent.blue    // #0A84FF - iOS Blau
colors.accent.purple  // #BF5AF2 - iOS Lila
```

### Background Colors (Dark Theme)

```typescript
colors.background.primary   // #000000 - App Hintergrund
colors.background.secondary // #1C1C1E - Karten (dunkelst)
colors.background.tertiary  // #2C2C2E - Erhöhte Karten
colors.background.elevated  // #3A3A3C - Input-Felder
colors.background.overlay   // #48484A - Höchste Elevation
```

### Text Colors

```typescript
colors.text.primary   // #FFFFFF - Primärer Text
colors.text.secondary // #8E8E93 - Sekundärer Text
colors.text.tertiary  // #98989D - Tertiärer Text
colors.text.disabled  // #636366 - Deaktivierter Text
colors.text.inverse   // #000000 - Inverser Text
```

### Semantic Colors

```typescript
// Success (Grün)
colors.success.main
colors.success.light
colors.success.dark
colors.success.background // Mit Transparenz

// Error (Rot)
colors.error.main
colors.error.light
colors.error.dark
colors.error.background

// Warning (Gelb)
colors.warning.main
colors.warning.light
colors.warning.dark
colors.warning.background

// Info (Blau)
colors.info.main
colors.info.light
colors.info.dark
colors.info.background
```

## Typography

### Font Sizes

```typescript
typography.fontSize.xs    // 12
typography.fontSize.sm    // 13
typography.fontSize.base  // 15
typography.fontSize.md    // 16
typography.fontSize.lg    // 17
typography.fontSize.xl    // 19
typography.fontSize['2xl'] // 20
typography.fontSize['3xl'] // 22
typography.fontSize['4xl'] // 28
typography.fontSize['5xl'] // 34
typography.fontSize['6xl'] // 40
```

### Font Weights

```typescript
typography.fontWeight.regular  // '400'
typography.fontWeight.medium   // '500'
typography.fontWeight.semibold // '600'
typography.fontWeight.bold     // '700'
```

### Vordefinierte Text Styles (iOS-inspiriert)

```typescript
// Große Titel
typography.styles.largeTitle  // 34px, bold
typography.styles.title1      // 28px, bold
typography.styles.title2      // 22px, bold
typography.styles.title3      // 20px, semibold

// Überschriften
typography.styles.headline    // 17px, semibold

// Body Text
typography.styles.body               // 17px, regular
typography.styles.bodyEmphasized     // 17px, semibold

// Callout
typography.styles.callout            // 16px, regular
typography.styles.calloutEmphasized  // 16px, semibold

// Subheadline
typography.styles.subheadline           // 15px, regular
typography.styles.subheadlineEmphasized // 15px, semibold

// Footnote
typography.styles.footnote           // 13px, regular
typography.styles.footnoteEmphasized // 13px, semibold

// Caption
typography.styles.caption1           // 12px, regular
typography.styles.caption1Emphasized // 12px, semibold
typography.styles.caption2           // 11px, regular
typography.styles.caption2Emphasized // 11px, semibold
```

## Spacing

### Base Spacing Scale (8px Grid)

```typescript
spacing[0]  // 0
spacing[1]  // 4
spacing[2]  // 8
spacing[3]  // 12
spacing[4]  // 16
spacing[5]  // 20
spacing[6]  // 24
spacing[7]  // 28
spacing[8]  // 32
spacing[10] // 40
spacing[12] // 48
spacing[16] // 64
spacing[20] // 80
spacing[24] // 96
```

### Semantic Layout Tokens

```typescript
// Container & Screen Padding
layout.containerPadding.horizontal  // 16
layout.containerPadding.vertical    // 16
layout.screenPadding.horizontal     // 16
layout.screenPadding.vertical       // 24

// Card Spacing
layout.cardPadding  // 16
layout.cardMargin.vertical    // 6
layout.cardMargin.horizontal  // 16
layout.cardGap     // 12

// Input & Button Padding
layout.inputPadding.vertical    // 14
layout.inputPadding.horizontal  // 16

layout.buttonPadding.small   // {vertical: 10, horizontal: 18}
layout.buttonPadding.medium  // {vertical: 16, horizontal: 24}
layout.buttonPadding.large   // {vertical: 18, horizontal: 32}
```

### Border Radius

```typescript
borderRadius.none  // 0
borderRadius.xs    // 4
borderRadius.sm    // 8
borderRadius.md    // 10
borderRadius.lg    // 12
borderRadius.xl    // 14
borderRadius['2xl'] // 16
borderRadius['3xl'] // 20
borderRadius['4xl'] // 24
borderRadius.full   // 9999
```

### Sizes

```typescript
// Icon Sizes
sizes.icon.xs  // 16
sizes.icon.sm  // 20
sizes.icon.md  // 24
sizes.icon.lg  // 32
sizes.icon.xl  // 40

// Badge/Avatar Sizes
sizes.badge.sm  // 32
sizes.badge.md  // 40
sizes.badge.lg  // 56
sizes.badge.xl  // 72

// Touch Targets
sizes.touchTarget.min         // 44
sizes.touchTarget.comfortable // 48

// Button & Input Heights
sizes.button.small  // 36
sizes.button.medium // 48
sizes.button.large  // 56

sizes.input.small  // 36
sizes.input.medium // 44
sizes.input.large  // 52
```

## Shadows

iOS-inspirierte Schatteneffekte:

```typescript
shadows.none
shadows.xs
shadows.sm
shadows.md
shadows.lg
shadows.xl
```

Verwendung:
```typescript
const styles = StyleSheet.create({
  card: {
    ...shadows.md,
  },
});
```

## Beispiele

### Button Component

```typescript
import { colors, typography, borderRadius, layout } from '../theme';

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.lg,
    paddingVertical: layout.buttonPadding.medium.vertical,
    paddingHorizontal: layout.buttonPadding.medium.horizontal,
  },
  buttonText: {
    color: colors.text.inverse,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
  },
});
```

### Card Component

```typescript
import { colors, borderRadius, layout } from '../theme';

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: layout.cardPadding,
    marginVertical: layout.cardMargin.vertical,
    marginHorizontal: layout.cardMargin.horizontal,
  },
});
```

### Input Component

```typescript
import { colors, typography, borderRadius, spacing, layout } from '../theme';

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.background.elevated,
    borderColor: colors.border.primary,
    borderRadius: borderRadius.md,
    paddingHorizontal: layout.inputPadding.horizontal,
    paddingVertical: layout.inputPadding.vertical,
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
  },
  inputError: {
    borderColor: colors.error.main,
  },
});
```

## Best Practices

### 1. Verwende immer Theme Tokens statt Hard-Coded Values

❌ **Falsch:**
```typescript
backgroundColor: '#1C1C1E',
fontSize: 16,
padding: 12,
```

✅ **Richtig:**
```typescript
backgroundColor: colors.background.secondary,
fontSize: typography.fontSize.md,
padding: spacing[3],
```

### 2. Nutze Semantische Tokens wo möglich

❌ **Falsch:**
```typescript
color: colors.error.main,  // Für primären Text
```

✅ **Richtig:**
```typescript
color: colors.text.primary,  // Für primären Text
color: colors.error.main,    // Nur für Error States
```

### 3. Konsistente Abstände mit dem 8px Grid

❌ **Falsch:**
```typescript
marginTop: 15,
paddingLeft: 13,
```

✅ **Richtig:**
```typescript
marginTop: spacing[4],  // 16px
paddingLeft: spacing[3], // 12px
```

### 4. Verwende vordefinierte Text Styles

❌ **Falsch:**
```typescript
fontSize: 17,
fontWeight: '600',
lineHeight: 22,
```

✅ **Richtig:**
```typescript
...typography.styles.headline,
```

## Design Philosophy

Das Design System folgt diesen Prinzipien:

1. **Dark First** - Optimiert für Dark Mode
2. **iOS Native Feel** - Angelehnt an iOS Design Guidelines
3. **Fitness-Focused** - Teal/Mint Akzente für Energie und Vitalität
4. **Accessibility** - Ausreichende Kontraste und Touch Targets
5. **Consistency** - Einheitliche Abstände, Größen und Farben
6. **Scalability** - Einfach erweiterbar für neue Komponenten

## Maintenance

Bei Änderungen am Design System:

1. Aktualisiere die entsprechenden Token-Dateien in `/src/theme/`
2. Teste alle Komponenten auf visuelle Konsistenz
3. Aktualisiere diese README wenn neue Tokens hinzugefügt werden
4. Dokumentiere Breaking Changes im Changelog

## Support

Bei Fragen oder Problemen mit dem Design System, erstelle ein Issue im Repository.
