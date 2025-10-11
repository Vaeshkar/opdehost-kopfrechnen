# Kopfrechnen Trainer v1.0.0

Ein interaktiver Mathe-Trainer mit Sprachausgabe für Kinder und Erwachsene. Die App hilft beim Üben der Grundrechenarten (Addition, Subtraktion, Multiplikation, Division) mit verschiedenen Schwierigkeitsgraden.

## Installation und Entwicklung

```bash
# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev

# Für Produktion bauen
npm run build

# Build-Vorschau
npm run preview
```

## Deployment auf Netlify

### Option 1: Drag & Drop

1. `npm run build` ausführen
2. Den `dist` Ordner auf [netlify.com](https://netlify.com) ziehen

### Option 2: Git Integration

1. Repository auf GitHub/GitLab pushen
2. Auf Netlify mit Git verbinden
3. Build-Einstellungen werden automatisch aus `netlify.toml` gelesen

### Option 3: Netlify CLI

```bash
# Netlify CLI installieren
npm install -g netlify-cli

# Einloggen
netlify login

# Deployen
netlify deploy --prod
```

## Features

- 🎯 **Übungsmodus**: Endloses Üben mit sofortigem Feedback
- 🏆 **Quiz-Modus**: 10 Fragen mit Bewertung
- 🔊 **Text-to-Speech**: Deutsche Sprachausgabe mit Web Speech API
- ⚙️ **Anpassbare Einstellungen**:
  - Rechenarten: +, -, ×, ÷
  - Schwierigkeitsgrade: Leicht, Mittel, Schwer
  - Verschiedene Feedback-Stile
  - Sprechgeschwindigkeit anpassbar
  - Kopfrechnen-Modus (nur Audio)
- 📱 **Responsive Design**: Funktioniert auf Desktop und Mobile
- 🎨 **Kinderfreundliches Design**: Bunte Farben und Emojis

## Technologie

- **React 18** mit Hooks
- **Vite** als Build-Tool
- **Lucide React** für Icons
- **Web Speech API** für Text-to-Speech (ersetzt puter.js)
- **CSS** mit Utility-Classes

## Browser-Kompatibilität

Die App nutzt die Web Speech API für Text-to-Speech. Unterstützte Browser:

- ✅ Chrome/Chromium (beste Unterstützung)
- ✅ Edge
- ✅ Safari (iOS/macOS)
- ⚠️ Firefox (eingeschränkte TTS-Unterstützung)

## Verwendung

1. **Einstellungen anpassen**: Rechenart, Schwierigkeit und Feedback-Stil wählen
2. **Stimme testen**: Deutsche Stimme auswählen und testen
3. **Modus wählen**: Übungsmodus für endloses Üben oder Quiz für 10 Fragen
4. **Aufgabe anhören**: Auf den Lautsprecher-Button klicken
5. **Antwort eingeben**: Zahl eingeben und Enter drücken oder Button klicken

## Version

1.0.0 - Vollständige React-App mit Standard Web Speech API
