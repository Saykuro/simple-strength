# Simple Strength

Eine minimalistische React Native App für Krafttraining-Tracking, entwickelt nach den höchsten Qualitätsstandards.

## 🏋️ Features

### Phase 1: MVP (Implementiert)
- ✅ **Onboarding**: 3-stufiger Willkommens-Screen mit beliebten Übungen
- ✅ **Exercise Builder**: Erstelle individuelle Übungen mit flexiblen Tracking-Komponenten
- ✅ **Workout Tracking**: Echtzeit-Timer und intuitive Satz-Protokollierung
- ✅ **Exercise Library**: Durchsuchbare Übungsbibliothek
- ✅ **Offline-Funktionalität**: Persistente Datenspeicherung mit MMKV

### Geplant (Phase 2)
- 📊 Fortschrittsvisualisierung mit Graphen
- 🏆 Personal Records (PRs) und Gamification
- ⌚ Garmin Connect Integration (Pro-Feature)
- 📈 1-Rep-Max Berechnungen und Trends

## 🛠️ Tech Stack

- **Frontend**: React Native + Expo
- **Backend**: Convex (Ready to integrate)
- **Authentication**: Clerk (Ready to integrate) 
- **State Management**: Zustand mit MMKV Persistierung
- **Code Quality**: BiomeJS (Linting & Formatting)
- **Testing**: Jest + React Native Testing Library
- **CI/CD**: GitHub Actions (Ready to setup)

## 🚀 Entwicklung

### Voraussetzungen
- Node.js 18+
- npm oder pnpm
- Expo CLI

### Installation
```bash
# Abhängigkeiten installieren
npm install --legacy-peer-deps

# iOS Simulator starten
npm run ios

# Android Emulator starten  
npm run android

# Web Development Server
npm run web
```

### Code-Qualität
Dieses Projekt folgt strengen Qualitätsrichtlinien entsprechend der GitHub Copilot Instructions:

```bash
# Build (MUSS erfolgreich sein)
npm run build

# Tests (MUSS erfolgreich sein)
npm test

# Linting (MUSS erfolgreich sein)
npm run lint

# TypeScript Check (MUSS erfolgreich sein)
npm run typecheck
```

**KRITISCHE REGEL**: Alle 4 Befehle müssen erfolgreich ausgeführt werden, bevor Code committet werden darf.

### Architektur-Prinzipien

**SOLID & Clean Code**
- **SRP**: Jede Komponente/Funktion hat genau eine Verantwortung
- **DIP**: Abhängigkeiten über Abstraktionen (Hooks/Services)
- **DRY**: Wiederverwendbare Logik in `/src/utils`
- **KISS**: Einfachste, lesbare Lösung bevorzugen

**Sicherheit**
- Server-side Validierung mit Zod für alle API-Eingaben
- Authentifizierung/Autorisierung für geschützte Daten
- Secrets ausschließlich in Umgebungsvariablen

**State Management**
- Granulare Zustand-Stores pro Domäne
- Selektoren zur Performance-Optimierung
- Geschäftslogik in Store-Actions

## 📱 App-Struktur

```
src/
├── components/          # Wiederverwendbare UI-Komponenten
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   └── ...
├── screens/            # Haupt-Screens der App
│   ├── OnboardingScreen.tsx
│   ├── HomeScreen.tsx
│   ├── WorkoutTrackingScreen.tsx
│   └── ...
├── stores/             # Zustand-Management
│   ├── workoutStore.ts
│   ├── exerciseStore.ts
│   └── ...
├── utils/              # Hilfsfunktionen & Berechnungen
│   ├── calculations.ts
│   └── ...
├── types/              # TypeScript-Typdefinitionen
├── constants/          # App-Konstanten
└── services/           # API & externe Services
```

## 🎯 Design-Prinzipien

### Radikale Einfachheit
- Minimalistisches UI ohne Ablenkungen
- Maximal 3 Klicks zu jeder Funktion
- Fokus auf Geschwindigkeit und Effizienz

### Maximale Flexibilität  
- Benutzerdefinierte Übungen mit beliebigen Tracking-Komponenten
- Keine Vorgaben oder Einschränkungen
- App passt sich dem Nutzer an

### Sichtbare Motivation
- Echtzeit-Feedback und Fortschrittsanzeigen
- Feier von Personal Records
- Einfache, motivierende Statistiken

## 📊 Testing

Das Projekt implementiert umfassende Tests auf mehreren Ebenen:

- **Unit Tests**: Geschäftslogik und Utility-Funktionen
- **Integration Tests**: Komponenten-Interaktionen (geplant)  
- **E2E Tests**: Kritische User-Flows (geplant mit Detox)

Aktuelle Test-Coverage: Utility-Funktionen (100%)

## 🚢 Deployment

### Development
```bash
# Expo Development Build
npm run build

# Lokaler Preview
npx expo start --tunnel
```

### Production (Geplant)
- iOS App Store via EAS Build
- Google Play Store via EAS Build
- Automatisierte Releases via GitHub Actions

## 📄 Lizenz

MIT License - Siehe [LICENSE](LICENSE) Datei.

## 🤝 Beitragen

1. Fork das Repository
2. Erstelle einen Feature-Branch (`git checkout -b feature/amazing-feature`)
3. **Führe alle Qualitätsprüfungen durch** (`npm run build && npm test && npm run lint && npm run typecheck`)
4. Commit deine Änderungen (`git commit -m 'Add amazing feature'`)
5. Push zum Branch (`git push origin feature/amazing-feature`)
6. Öffne eine Pull Request

**Wichtig**: PRs werden nur akzeptiert, wenn alle Code-Qualität-Checks bestehen.

---

*Simple Strength - Das einfachste Workout-Tracking für sichtbaren Fortschritt. Kein Schnickschnack, nur deine Stärke.*