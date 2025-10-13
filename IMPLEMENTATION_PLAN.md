# Simple Strength - Umsetzungsplan

**Projekt:** Simple Strength React Native App  
**Datum:** 13. Oktober 2025  
**Status:** In Planung

## Übersicht

Dieser Plan beschreibt die schrittweise Umsetzung der "Simple Strength" App gemäß der Spezifikation in `SPEC.md`. Jeder Schritt baut auf dem vorherigen auf und folgt den Code-Qualitätsrichtlinien des Projekts.

## Phase 1: Foundation (MVP Basis) - Wochen 1-4

### 1. Projekt-Setup & Grundstruktur

**Status:** ⏳ Nicht begonnen  
**Geschätzter Aufwand:** 1-2 Tage  

**Aufgaben:**

- [ ] React Native CLI Projekt initialisieren
- [ ] Grundlegende Ordnerstruktur erstellen:

  ```
  src/
  ├── components/     # Wiederverwendbare UI-Komponenten
  ├── screens/        # Screen-Komponenten
  ├── navigation/     # Navigation-Setup
  ├── services/       # API-Services (Convex)
  ├── stores/         # Zustand-Stores
  ├── utils/          # Utility-Funktionen
  ├── types/          # TypeScript-Typen
  └── constants/      # App-Konstanten
  ```

- [ ] Dependencies installieren und konfigurieren:
  - React Navigation
  - Convex (Backend)
  - Clerk (Auth)
  - Zustand (State Management)
  - BiomeJS (Linting/Formatting)
- [ ] TypeScript Konfiguration
- [ ] BiomeJS Setup für Linting/Formatting

**Akzeptanzkriterien:**

- ✅ App startet erfolgreich auf iOS/Android Simulator
- ✅ Alle Linting-Regeln sind konfiguriert
- ✅ `pnpm build`, `pnpm test`, `pnpm lint`, `pnpm typecheck` laufen erfolgreich

---

### 2. Backend & Auth Setup

**Status:** ⏳ Nicht begonnen  
**Geschätzter Aufwand:** 2-3 Tage  
**Abhängigkeiten:** Schritt 1

**Aufgaben:**

- [ ] Convex Backend initialisieren
- [ ] Datenmodelle definieren:

  ```typescript
  // User Model
  interface User {
    _id: Id<"users">;
    clerkId: string;
    name: string;
    email: string;
    createdAt: number;
  }

  // Exercise Model
  interface Exercise {
    _id: Id<"exercises">;
    userId: Id<"users">;
    name: string;
    trackingComponents: {
      weight: boolean;
      reps: boolean;
      time: boolean;
      distance: boolean;
      notes: boolean;
    };
    createdAt: number;
    isArchived: boolean;
  }

  // Workout Model
  interface Workout {
    _id: Id<"workouts">;
    userId: Id<"users">;
    name?: string;
    startTime: number;
    endTime?: number;
    duration?: number;
    createdAt: number;
  }

  // Set Model
  interface Set {
    _id: Id<"sets">;
    workoutId: Id<"workouts">;
    exerciseId: Id<"exercises">;
    weight?: number;
    reps?: number;
    time?: number;
    distance?: number;
    notes?: string;
    createdAt: number;
    order: number;
  }
  ```

- [ ] Clerk Authentifizierung konfigurieren
- [ ] Basis-Convex-Funktionen erstellen:
  - `users.ts` - User-Management
  - `exercises.ts` - CRUD für Übungen
  - `workouts.ts` - Workout-Management
  - `sets.ts` - Set-Management
- [ ] Auth-Middleware für protected routes

**Akzeptanzkriterien:**

- ✅ User kann sich registrieren und einloggen
- ✅ Datenmodelle sind in Convex definiert
- ✅ CRUD-Operationen für alle Modelle funktionieren
- ✅ Auth-State wird korrekt verwaltet

---

### 3. Core UI Components

**Status:** ⏳ Nicht begonnen  
**Geschätzter Aufwand:** 2-3 Tage  
**Abhängigkeiten:** Schritt 1

**Aufgaben:**

- [ ] Design System implementieren:

  ```typescript
  // Design Tokens
  export const colors = {
    primary: {
      50: '#eff6ff',
      500: '#3b82f6',
      900: '#1e3a8a',
    },
    // Light & Dark Mode Varianten
  };
  
  export const typography = {
    h1: { fontSize: 32, fontWeight: 'bold' },
    h2: { fontSize: 24, fontWeight: '600' },
    body: { fontSize: 16, fontWeight: 'normal' },
  };
  ```

- [ ] Basis-Komponenten entwickeln:
  - `Button` (Primary, Secondary, Ghost)
  - `Input` (Text, Number, mit Validation)
  - `Card` (verschiedene Varianten)
  - `Header` (mit Back-Button, Title, Actions)
  - `LoadingSpinner`
  - `EmptyState`
- [ ] Theme Provider für Light/Dark Mode
- [ ] React Navigation Setup:
  - Tab Navigator (Workout, Progress, Profile)
  - Stack Navigator für einzelne Flows

**Akzeptanzkriterien:**

- ✅ Alle Basis-Komponenten sind implementiert und typisiert
- ✅ Light/Dark Mode funktioniert
- ✅ Navigation zwischen Screens funktioniert
- ✅ Components sind in Storybook dokumentiert (optional)

---

### 4. Onboarding Flow

**Status:** ⏳ Nicht begonnen  
**Geschätzter Aufwand:** 1-2 Tage  
**Abhängigkeiten:** Schritt 2, 3

**Aufgaben:**

- [ ] 3-stufiger Willkommens-Screen implementieren:
  1. **Tracken:** "Protokolliere deine Workouts mühelos"
  2. **Bauen:** "Erstelle deine eigenen Übungen"
  3. **Wachsen:** "Verfolge deinen Fortschritt"
- [ ] Liste mit 15 populären Übungen erstellen:

  ```typescript
  const popularExercises = [
    { name: "Bankdrücken", trackingComponents: { weight: true, reps: true } },
    { name: "Kniebeugen", trackingComponents: { weight: true, reps: true } },
    { name: "Kreuzheben", trackingComponents: { weight: true, reps: true } },
    // ... weitere 12 Übungen
  ];
  ```

- [ ] Multi-Select für Übungsauswahl
- [ ] "Erstes Workout starten" CTA
- [ ] AsyncStorage für Onboarding-Status

**Akzeptanzkriterien:**

- ✅ Neue User sehen Onboarding beim ersten App-Start
- ✅ Übungen können ausgewählt und zur Library hinzugefügt werden
- ✅ Nach Onboarding wird User zum Workout-Screen geleitet
- ✅ Onboarding wird nur einmal angezeigt

---

### 5. Exercise Builder

**Status:** ⏳ Nicht begonnen  
**Geschätzter Aufwand:** 2 Tage  
**Abhängigkeiten:** Schritt 2, 3

**Aufgaben:**

- [ ] Exercise Builder Screen implementieren:
  - Name-Input (Required Field mit Validation)
  - Checkbox-Selection für Tracking-Komponenten:
    - ✅ Gewicht (kg)
    - ✅ Wiederholungen
    - ✅ Zeit (mm:ss)
    - ✅ Distanz (km)
    - ✅ Notizen (Freitext)
- [ ] Form-Validation:
  - Name ist Pflichtfeld (min. 2 Zeichen)
  - Mindestens eine Tracking-Komponente muss ausgewählt sein
- [ ] Übung speichern und zur Library hinzufügen
- [ ] Error Handling und Success Feedback

**Akzeptanzkriterien:**

- ✅ Übungen können mit Namen und Tracking-Komponenten erstellt werden
- ✅ Form-Validation funktioniert korrekt
- ✅ Erstellte Übungen erscheinen sofort in der Library
- ✅ Error States werden korrekt angezeigt

---

### 6. Exercise Library

**Status:** ⏳ Nicht begonnen  
**Geschätzter Aufwand:** 2-3 Tage  
**Abhängigkeiten:** Schritt 5

**Aufgaben:**

- [ ] Exercise Library Screen implementieren:
  - Liste aller Übungen des Users
  - Search-Funktionalität (Name-based)
  - Filter nach Tracking-Komponenten
  - Sortierung (A-Z, Zuletzt verwendet, Erstellt)
- [ ] Exercise Card Komponente:
  - Übungsname
  - Tracking-Badges (Gewicht, Reps, etc.)
  - Letzte Nutzung anzeigen
  - Edit/Delete Actions
- [ ] CRUD-Operationen:
  - Übung bearbeiten
  - Übung löschen (mit Confirmation)
  - Übung archivieren
- [ ] Empty State für neue User
- [ ] Pull-to-Refresh

**Akzeptanzkriterien:**

- ✅ Alle Übungen werden korrekt angezeigt
- ✅ Suche und Filter funktionieren
- ✅ Edit/Delete Operationen funktionieren
- ✅ Performance ist auch bei vielen Übungen gut

---

### 7. Active Workout Session

**Status:** ⏳ Nicht begonnen  
**Geschätzter Aufwand:** 3-4 Tage  
**Abhängigkeiten:** Schritt 6

**Aufgaben:**

- [ ] Workout Session Screen implementieren:
  - Workout-Timer (Gesamtdauer)
  - "Übung hinzufügen" Button → Exercise Library
  - Liste der hinzugefügten Übungen
- [ ] Exercise in Workout Komponente:
  - Übungsname und Tracking-Komponenten
  - "Letzter Satz"-Referenz anzeigen
  - "Satz hinzufügen" Button
  - Chronologische Liste aller Sätze
- [ ] Set Input Modal:
  - Dynamische Felder basierend auf Tracking-Komponenten
  - Previous Set als Vorlage
  - Validierung (Gewicht > 0, Reps > 0, etc.)
- [ ] Workout Management:
  - Workout starten/pausieren/beenden
  - Autosave-Funktionalität
  - Workout verwerfen mit Confirmation

**Akzeptanzkriterien:**

- ✅ Timer läuft korrekt während des Workouts
- ✅ Übungen können hinzugefügt werden
- ✅ Sätze können für jede Übung protokolliert werden
- ✅ Letzte Sätze werden als Referenz angezeigt
- ✅ Workout kann beendet und gespeichert werden

## Phase 2: Core Functionality - Wochen 5-8

### 8. Workout History & Data

**Status:** ⏳ Nicht begonnen  
**Geschätzter Aufwand:** 2-3 Tage  
**Abhängigkeiten:** Schritt 7

**Aufgaben:**

- [ ] Workout History Screen:
  - Chronologische Liste aller Workouts
  - Workout-Details (Datum, Dauer, Übungen, Volumen)
  - Filter nach Zeitraum
- [ ] Datenlogik implementieren:

  ```typescript
  // Volumenberechnung
  const calculateVolume = (sets: Set[]): number => {
    return sets.reduce((total, set) => {
      if (set.weight && set.reps) {
        return total + (set.weight * set.reps);
      }
      return total + (set.reps || 0);
    }, 0);
  };

  // 1RM Berechnung (Epley-Formel)
  const calculate1RM = (weight: number, reps: number): number => {
    return weight * (1 + reps / 30);
  };
  ```

- [ ] Exercise Statistics:
  - Personal Records (Max Weight, Max Reps, Max Volume)
  - 1RM Tracking
  - Volume Progression
- [ ] Data Export Funktionalität (Pro Feature)

**Akzeptanzkriterien:**

- ✅ Workout-Historie wird korrekt angezeigt
- ✅ Volumen und 1RM werden korrekt berechnet
- ✅ Personal Records werden identifiziert
- ✅ Datenintegrität ist gewährleistet

---

### 9. Progress Visualization

**Status:** ⏳ Nicht begonnen  
**Geschätzter Aufwand:** 3-4 Tage  
**Abhängigkeiten:** Schritt 8

**Aufgaben:**

- [ ] Chart Library Integration (Victory Native)
- [ ] Exercise Detail Screen:
  - Trainingsvolumen-Graph (letzte 12 Workouts)
  - 1RM-Entwicklung-Graph
  - Personal Records Liste
  - Statistiken (Durchschnittsvolumen, beste Serie, etc.)
- [ ] Progress Overview Screen:
  - Gesamtvolumen über Zeit
  - Workout-Frequenz
  - Top-Übungen nach Volumen
- [ ] Chart Interaktivität:
  - Zoom und Pan
  - Datenpunkt-Details on Tap
  - Zeitraum-Filter

**Akzeptanzkriterien:**

- ✅ Alle Graphen zeigen korrekte Daten an
- ✅ Charts sind interaktiv und performant
- ✅ Personal Records sind hervorgehoben
- ✅ Verschiedene Zeiträume können ausgewählt werden

---

### 10. Offline Support

**Status:** ⏳ Nicht begonnen  
**Geschätzter Aufwand:** 2-3 Tage  
**Abhängigkeiten:** Schritt 7

**Aufgaben:**

- [ ] Zustand Persist Setup:
  - Workout-State lokal speichern
  - Exercise Library Cache
  - User Preferences
- [ ] Offline-Workout-Funktionalität:
  - Workout kann ohne Internet gestartet werden
  - Lokale Speicherung aller Workout-Daten
  - Queue für Sync bei Reconnect
- [ ] Sync-Mechanismus:
  - Auto-Sync bei App-Start
  - Background-Sync bei Network-Reconnect
  - Conflict-Resolution bei Daten-Konflikten
- [ ] Offline-Indicator in der UI

**Akzeptanzkriterien:**

- ✅ App funktioniert vollständig offline
- ✅ Daten werden automatisch synchronisiert
- ✅ Keine Datenverluste bei Netzwerkproblemen
- ✅ User wird über Offline-Status informiert

---

### 11. Performance Optimization

**Status:** ⏳ Nicht begonnen  
**Geschätzter Aufwand:** 2-3 Tage  
**Abhängigkeiten:** Alle vorherigen Schritte

**Aufgaben:**

- [ ] App-Performance analysieren:
  - Bundle-Size optimieren
  - Flipper Integration für Performance-Monitoring
  - Memory-Leaks identifizieren
- [ ] Rendering-Optimierung:
  - FlatList für große Listen
  - Memo/useMemo für teure Berechnungen
  - LazyLoading für Screens
- [ ] Startup-Optimierung:
  - Splash Screen optimieren
  - Initial Bundle reduzieren
  - Lazy Component Loading
- [ ] Animation-Performance:
  - Native Driver für Animationen
  - 60 FPS für alle Transitions
  - Reduce Motion Support

**Akzeptanzkriterien:**

- ✅ App-Start unter 3 Sekunden (Kaltstart)
- ✅ Alle Animationen laufen mit 60 FPS
- ✅ Memory-Usage bleibt stabil
- ✅ Bundle-Size unter 50MB

## Phase 3: Quality & Polish - Wochen 9-10

### 12. Testing Implementation

**Status:** ⏳ Nicht begonnen  
**Geschätzter Aufwand:** 3-4 Tage  
**Abhängigkeiten:** Alle Core Features

**Aufgaben:**

- [ ] Test-Setup konfigurieren:
  - Jest für Unit-Tests
  - React Native Testing Library
  - MSW für API-Mocking
- [ ] Unit-Tests schreiben:
  - Utility-Funktionen (calculateVolume, calculate1RM)
  - Zustand Stores
  - Helper-Functions
- [ ] Integration-Tests:
  - Workout-Flow (Start → Add Exercise → Add Sets → Finish)
  - Exercise-Creation-Flow
  - Auth-Flow
- [ ] Component-Tests:
  - Critical UI-Components
  - Form-Validation
  - Navigation
- [ ] Test-Coverage auf >80% bringen

**Akzeptanzkriterien:**

- ✅ Test-Coverage >80%
- ✅ Alle kritischen User-Flows sind getestet
- ✅ CI/CD führt Tests automatisch aus
- ✅ Keine flaky Tests

---

### 13. Gamification Features

**Status:** ⏳ Nicht begonnen  
**Geschätzter Aufwand:** 2-3 Tage  
**Abhängigkeiten:** Schritt 8, 9

**Aufgaben:**

- [ ] Personal Record Detection:
  - Automatische PR-Erkennung bei Set-Entry
  - PR-Types (Max Weight, Max Reps, Max Volume, Max 1RM)
- [ ] PR-Celebration:
  - Konfetti-Animation bei neuem PR
  - PR-Notification mit Details
  - Sound-Effekte (optional)
- [ ] Workout-Streaks:
  - Berechnung konsekutiver Workout-Wochen
  - Streak-Display im Dashboard
  - Streak-Loss-Warning
- [ ] Achievement-System:
  - Badge-Definitionen (10 Workouts, 100 Sets, etc.)
  - Badge-Unlock-Animations
  - Achievement-Overview Screen

**Akzeptanzkriterien:**

- ✅ PRs werden automatisch erkannt und gefeiert
- ✅ Workout-Streaks werden korrekt berechnet
- ✅ Achievements motivieren zur Nutzung
- ✅ Alle Animationen sind performant

---

### 14. Analytics & Error Tracking

**Status:** ⏳ Nicht begonnen  
**Geschätzter Aufwand:** 1-2 Tage  
**Abhängigkeiten:** Schritt 1

**Aufgaben:**

- [ ] PostHog Integration:
  - Privacy-konforme Event-Tracking
  - User-Journey-Analysis
  - Feature-Usage-Tracking
- [ ] Sentry Integration:
  - Crash-Reporting
  - Performance-Monitoring
  - User-Feedback-Integration
- [ ] Custom Analytics Events:
  - Workout-Completed
  - Exercise-Created
  - PR-Achieved
  - Feature-Usage
- [ ] Privacy Compliance:
  - GDPR-konforme Datenerfassung
  - Opt-out-Mechanismus
  - Transparente Datenschutzerklärung

**Akzeptanzkriterien:**

- ✅ Crashes werden automatisch reportet
- ✅ User-Verhalten wird privacy-konform getrackt
- ✅ Performance-Probleme werden erkannt
- ✅ GDPR-Compliance ist sichergestellt

---

### 15. CI/CD Pipeline

**Status:** ⏳ Nicht begonnen  
**Geschätzter Aufwand:** 2-3 Tage  
**Abhängigkeiten:** Schritt 12

**Aufgaben:**

- [ ] GitHub Actions Setup:

  ```yaml
  # .github/workflows/ci.yml
  name: CI
  on: [push, pull_request]
  jobs:
    test:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3
        - run: pnpm install
        - run: pnpm typecheck
        - run: pnpm lint
        - run: pnpm test
        - run: pnpm build
  ```

- [ ] Automated Testing:
  - PR-Builds mit vollständiger Test-Suite
  - Code-Coverage-Reports
  - Lint-Checks
- [ ] Release-Automation:
  - Automatic Versioning (Semantic Release)
  - Changelog-Generation
  - Build-Artifacts-Upload
- [ ] App Store Deployment:
  - iOS App Store Connect Integration
  - Android Google Play Console Integration
  - Beta-Testing-Distribution

**Akzeptanzkriterien:**

- ✅ Alle PRs werden automatisch getestet
- ✅ Release-Process ist vollständig automatisiert
- ✅ App Store Uploads funktionieren
- ✅ Beta-Versionen können verteilt werden

---

## Qualitätssicherung

Nach jedem abgeschlossenen Schritt **MUSS** folgendes erfolgreich ausgeführt werden:

```bash
pnpm build     # ✅ Build muss erfolgreich sein
pnpm test      # ✅ Alle Tests müssen bestehen
pnpm lint      # ✅ Keine Linting-Fehler
pnpm typecheck # ✅ Keine TypeScript-Fehler
```

**Keine Ausnahmen** - Code-Qualität ist nicht verhandelbar.

---

## Erfolgs-Metriken

### Technische Metriken

- [ ] App-Start unter 3 Sekunden
- [ ] 60 FPS bei allen Animationen
- [ ] Test-Coverage >80%
- [ ] Bundle-Size <50MB
- [ ] Memory-Usage stabil

### Business-Metriken (Post-Launch)

- [ ] Aktivierungsrate >50% (1. Workout in 3 Tagen)
- [ ] W1-Retention >40%
- [ ] App Store Rating >4.0
- [ ] Crash-Rate <1%

---

## Nächste Schritte

1. **Aktuellen Status markieren:** Markiere den ersten Schritt als "In Arbeit"
2. **Entwicklungsumgebung prüfen:** Stelle sicher, dass React Native, Node.js, etc. installiert sind
3. **Repository einrichten:** Initialisiere Git-Repository und erste Commits
4. **Schritt 1 starten:** Projekt-Setup & Grundstruktur implementieren

**Ready to start? 🚀**^
