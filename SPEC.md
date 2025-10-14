# Projektspezifikation: Simple Strength

**Version:** 1.0  
**Datum:** 12. Oktober 2025  
**Status:** Finalisiert für die initiale Entwicklung

## 1. Projektübersicht & Vision

"Simple Strength" ist eine mobile Cross-Platform-Anwendung (iOS & Android), entwickelt mit React Native + Expo. Die App bietet Nutzern die einfachste und flexibelste Möglichkeit, ihr Krafttraining zu protokollieren und ihren Fortschritt zu visualisieren.

**Vision:** Wir beseitigen die Komplexität und Unübersichtlichkeit moderner Fitness-Apps und fokussieren uns auf das Wesentliche: den Nutzer bei der Erreichung seiner Ziele durch klare, motivierende Fortschrittsdaten zu unterstützen.

### Leitprinzipien

- **Radikale Einfachheit:** Jede Funktion wird auf maximale Benutzerfreundlichkeit und minimalen Aufwand optimiert.
- **Maximale Flexibilität:** Die App passt sich dem Nutzer an, nicht umgekehrt.
- **Sichtbare Motivation:** Der Fokus liegt auf der klaren Visualisierung des eigenen Fortschritts.

## 2. Lean Canvas

| Problem | Lösung | Schlüsselmetriken | Einzigartiges Wertversprechen (UVP) |
|---------|--------|-------------------|-------------------------------------|
| 1. Bestehende Fitness-Apps sind überladen und langsam. 2. Manuelle Methoden (Notizbuch) sind ineffizient. 3. Mangelnde Motivation durch fehlende, sichtbare Erfolge. | 1. Minimalistisches Tracking-Interface 2. Flexibler "Exercise Builder" 3. Automatische Fortschrittsvisualisierung & PR-Feiern | 1. Aktivierungsrate (>50% der Nutzer loggen 1. Workout in 3 Tagen) 2. W1-Retention (>40%) 3. Conversion Rate (Free zu Pro) | Das einfachste Workout-Tracking für sichtbaren Fortschritt. Kein Schnickschnack, nur deine Stärke. |

| Unfairer Vorteil | Kanäle | Kundensegmente | Kostenstruktur |
|------------------|--------|----------------|----------------|
| 1. Laser-Fokus auf Einfachheit & UX. 2. Loyale Community, die Feature-Bloat ablehnt. 3. Schneller Entwicklungszyklus. | 1. App Stores (ASO) 2. Content Marketing (Blog, Social Media) 3. Community Engagement (Reddit, Foren) | **Primär:** Fitness-Einsteiger (18-35) **Sekundär:** Effizienz-suchende Amateure **Early Adopters:** Tech-affine Fitness-Enthusiasten | **Fix:** Entwicklungsgehälter, Plattform-Gebühren **Variabel:** Backend/Auth (Convex, Clerk), Marketing-Budget |

| **Einnahmequellen** |
|---------------------|
| **Freemium-Modell:** **Kostenlos:** Unbegrenztes Tracking & Übungserstellung. **Pro-Abo:** Garmin-Integration, Trainingspläne, erweiterte Statistiken, Daten-Export. |

## 3. Technischer Stack

| Kategorie | Tool | Rolle im Projekt |
|-----------|------|------------------|
| Frontend | React Native + Expo | Cross-Platform-Entwicklung für iOS & Android. |
| Backend | Convex | Datenbank, Serverless-Funktionen und Echtzeit-Synchronisation. |
| Authentifizierung | Clerk | Sichere Benutzerverwaltung und Login. |
| State Management | Zustand | Minimalistische, clientseitige Zustandsverwaltung (mit Persistenz). |
| Code-Qualität | BiomeJS | Einheitliches, schnelles Tool für Linting und Formatting. |
| Testing | Jest & RNTL | Unit- und Komponenten-Tests. |
| CI/CD | GitHub Actions | Automatisierte Builds, Tests und Releases. |
| Analytics | PostHog | Datenschutzfreundliches Tracking des Nutzerverhaltens. |
| Crash Reporting | Sentry | Automatisches Melden von App-Abstürzen. |
| API-Integration | Garmin Connect API | Optionales Tracking von Schritten und Puls (Pro-Feature). |

## 4. Detaillierte Funktionsspezifikation (User Stories)

### 4.1. Onboarding & Ersteinrichtung

**User Story:** Als neuer Nutzer möchte ich schnell und unkompliziert durch die App geführt werden, um sofort den Mehrwert zu verstehen.

**Akzeptanzkriterien:**

- ✅ Ein 3-stufiger Willkommens-Screen erklärt die Kernvorteile (Tracken, Bauen, Wachsen).
- ✅ Dem Nutzer wird eine Liste von 15 populären Übungen zur Auswahl angeboten, um seine Bibliothek vorab zu füllen.
- ✅ Der Prozess endet mit einem klaren Call-to-Action: "Erstes Workout starten".

### 4.2. Übungsverwaltung (Exercise Builder)

**User Story:** Als Nutzer möchte ich meine eigenen Übungen definieren können, damit ich mein spezifisches Training exakt tracken kann.

**Akzeptanzkriterien:**

- ✅ Ein "+" Button in der Übungsbibliothek öffnet den Erstellungs-Screen.
- ✅ Ein Name für die Übung ist ein Pflichtfeld.
- ✅ Tracking-Komponenten (Gewicht, Wiederholungen, Zeit, Distanz, Notizen) können per Checkbox ausgewählt werden.
- ✅ Die erstellte Übung erscheint sofort in der durchsuchbaren Bibliothek.

### 4.3. Workout Tracking (Active Session)

**User Story:** Als Nutzer möchte ich während des Trainings schnell und reibungslos meine Sätze protokollieren.

**Akzeptanzkriterien:**

- ✅ Ein gestartetes Workout zeigt einen laufenden Timer für die Gesamtdauer.
- ✅ Übungen können aus der Bibliothek zum Workout hinzugefügt werden.
- ✅ Unter jeder Übung wird der letzte protokollierte Satz als Referenz angezeigt ("Letztes Mal: 80kg x 5").
- ✅ Ein "Satz hinzufügen"-Button öffnet die passenden Eingabefelder.
- ✅ Geloggte Sätze werden in einer chronologischen Liste unter der Übung angezeigt.
- ✅ Ein Workout kann jederzeit beendet und gespeichert werden.

### 4.4. Fortschrittsvisualisierung

**User Story:** Als Nutzer möchte ich meinen Fortschritt für eine bestimmte Übung über die Zeit klar erkennen können.

**Akzeptanzkriterien:**

- ✅ Die Detailseite einer Übung zeigt einen Liniengraphen für die Entwicklung des Trainingsvolumens.
- ✅ Ein zweiter Graph zeigt die Entwicklung des geschätzten 1-Rep-Max (1RM).
- ✅ Eine Liste zeigt die persönlichen Rekorde (PRs) für diese Übung (z.B. "Höchstes Gewicht", "Meiste Wiederholungen").

## 5. Geschäftslogik & Nicht-funktionale Anforderungen

### 5.1. Datenlogik

- **Umbenennen von Übungen:** Ändert nur das name-Attribut. Alle historischen Daten bleiben dank einer stabilen exerciseId konsistent.
- **Volumenberechnung:** Volumen = weight * reps. Wenn weight nicht getrackt wird, ist Volumen = reps.
- **1-Rep-Max (1RM) Schätzung:** Berechnung nach der Epley-Formel: 1RM = weight * (1 + reps / 30).

### 5.2. Performance & UX

- **App-Start:** Kaltstart unter 3 Sekunden.
- **UI-Performance:** Flüssige 60 FPS bei allen Animationen und Scroll-Vorgängen.
- **Offline-Fähigkeit:** Ein komplettes Workout kann ohne Internetverbindung erfasst werden. Die Daten werden lokal zwischengespeichert und bei Wiederverbindung automatisch synchronisiert.
- **Design:** Die App unterstützt einen Light- und Dark-Mode und ist auf allen gängigen Smartphone-Größen responsiv.

### 5.3. Gamification

- **Personal Records (PRs):** Das Erreichen eines neuen PRs wird mit einer auffälligen Animation gefeiert.
- **Workout-Streaks:** Das Dashboard zeigt an, wie viele Wochen in Folge der Nutzer trainiert hat.
- **Erfolge (Badges):** Meilensteine (z.B. "10 Workouts absolviert") werden mit Abzeichen belohnt.

## 6. Entwicklungs-Roadmap

### Phase 1: Minimum Viable Product (MVP)

**Ziel:** Die schnellste und einfachste Tracking-Erfahrung auf dem Markt schaffen.

**Features:** Onboarding, Übungsverwaltung, Workout Tracking, grundlegende Fortschrittsgraphen.

### Phase 2: Erweiterung & Motivation

**Ziel:** Nutzerbindung erhöhen und erste Pro-Features integrieren.

**Features:** Gamification-Elemente (PRs, Streaks), Garmin-Integration, Erstellung von Trainingsplänen.

### Zukünftige Ideen (Post-Launch)

- Apple Watch / Wear OS App.
- Soziale Funktionen (Teilen von Workouts).
- Homescreen-Widgets.
