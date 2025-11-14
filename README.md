# 🎓 Application de Productivité Scolaire

Application complète de productivité pour étudiants, conçue pour iPad, avec persistance localStorage.

## 🚀 Fonctionnalités

### ✅ Gestion des matières et chapitres
- Création/édition/suppression de matières avec couleurs et icônes
- Chapitres avec priorité, niveau de maîtrise (0-5 étoiles), dates d'examen
- Organisation intuitive par matière

### 📅 Planning hebdomadaire
- Vue semaine avec grid 7 jours
- Ajout/modification/suppression de sessions
- Marquage des sessions complétées
- Navigation entre les semaines

### ⏱️ Timer Pomodoro
- Presets configurables (25/5, 40/10, 50/10)
- Timer circulaire animé
- Phases focus et pause
- Statistiques quotidiennes et totales
- Gestion des streaks

### 🎓 Mode Classe (Feature phare)
**3 phases complètes :**

1. **Avant le cours** : 
   - Sélection matière/chapitre
   - Choix de 1-3 objectifs
   - Micro-défi aléatoire

2. **Pendant le cours** :
   - Interface minimaliste plein écran
   - Compteur d'attention ajustable (0-5)
   - Compteur de distractions
   - Notes rapides
   - Navigation bloquée

3. **Après le cours** :
   - Évaluation attention (0-10)
   - Résumé en une phrase
   - Points à revoir
   - Validation du défi
   - Calcul XP avec bonus

### 🎮 Gamification
- Système XP avec niveaux
- 18+ badges à débloquer
- Streaks quotidiens
- Récompenses pour actions (Pomodoro, sessions, cours, etc.)

### 📊 Statistiques
- Minutes étudiées totales
- Répartition par matière
- Sessions complétées vs prévues
- Stats mode classe (attention, défis, etc.)
- Graphiques de progression

## 🛠️ Stack Technique

- **Framework** : Next.js 14 + TypeScript
- **UI** : Tailwind CSS + composants personnalisés (inspirés shadcn/ui)
- **State Management** : React Hooks + localStorage
- **Persistance** : localStorage uniquement (pas de backend)
- **Déploiement** : Vercel-ready

## 📁 Structure du projet

```
/workspace/
├── components/
│   ├── ui/              # Composants UI de base
│   ├── subjects/        # Composants matières/chapitres
│   ├── planning/        # Composants planning
│   ├── pomodoro/        # Composants timer
│   ├── class-mode/      # Composants mode classe ⭐
│   ├── gamification/    # Composants XP/badges
│   └── stats/           # Composants statistiques
├── hooks/
│   ├── usePersistentState.ts
│   ├── useSubjects.ts
│   ├── usePlanning.ts
│   ├── usePomodoro.ts
│   ├── useXP.ts
│   ├── useClassMode.ts  # Hook mode classe ⭐
│   └── useStats.ts
├── lib/
│   ├── storage/         # Service localStorage
│   ├── gamification/    # Calculs XP & badges
│   ├── class/           # Générateur de défis ⭐
│   └── utils/           # Utilitaires
├── types/               # Types TypeScript
└── pages/               # Pages Next.js

```

## 🚀 Installation et lancement

```bash
# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Builder pour production
npm run build

# Lancer la production
npm start
```

## 📱 Optimisations iPad

- Touch-first design (boutons min 44x44px)
- Navigation bottom pour zone pouce
- Support paysage et portrait
- Pas de hover states critiques
- Texte lisible (16px minimum)
- Gestures intuitifs

## 💾 Stockage des données

Toutes les données sont stockées en **localStorage** :
- `app_subjects` : Matières et chapitres
- `app_planning_sessions` : Sessions de planning
- `app_pomodoro_stats` : Statistiques Pomodoro
- `app_user_progress` : XP, badges, streaks
- `app_class_sessions` : Sessions de classe
- `app_class_stats` : Statistiques mode classe

**Quota** : ~5-10 MB selon navigateur

## 🎯 Points forts du Mode Classe

Le mode classe est la **feature unique** de l'application :

1. **Motivation pré-cours** : Objectifs et défis pour se mettre en condition
2. **Tracking en temps réel** : Attention et distractions pendant le cours
3. **Auto-évaluation** : Réflexion immédiate après le cours
4. **Gamification dédiée** : XP et badges spécifiques au mode classe
5. **Statistiques d'attention** : Suivi de la progression en cours

## 🔐 Sécurité & Vie privée

- ✅ Pas de backend, pas de serveur
- ✅ Données 100% locales
- ✅ Pas de tracking
- ✅ Pas d'authentification nécessaire
- ✅ Fonctionne offline

## 📦 Déploiement Vercel

```bash
# Déployer sur Vercel
vercel

# ou via Git (automatique)
git push origin main
```

**Important** :
- Tous les composants avec localStorage utilisent `'use client'`
- Gestion SSR/client via `useEffect` + flag `isMounted`
- Pas de `window` ou `localStorage` côté serveur

## 🎨 Personnalisation

### Couleurs
Modifier dans `styles/globals.css` :
```css
:root {
  --primary: #3B82F6;
  --secondary: #8B5CF6;
  /* ... */
}
```

### Presets Pomodoro
Modifier dans `hooks/usePomodoro.ts` :
```typescript
const PRESET_CONFIGS = {
  '25-5': { focus: 25, break: 5 },
  // ...
}
```

### Badges
Ajouter dans `lib/gamification/badgeSystem.ts`

### Défis Classe
Ajouter dans `lib/class/challengeGenerator.ts`

## 🐛 Debug

En cas de problème :

1. **Ouvrir la console navigateur** (F12)
2. **Vérifier localStorage** : Application > Storage > Local Storage
3. **Effacer les données** : `localStorage.clear()` dans la console
4. **Recharger la page** : Ctrl+Shift+R (hard refresh)

## 📝 TODO / Améliorations futures

- [ ] Export/import données (JSON)
- [ ] Thème sombre
- [ ] PWA (installable)
- [ ] Notifications navigateur
- [ ] Sync multi-devices (optionnel)
- [ ] Tests unitaires (Vitest)
- [ ] Tests E2E (Playwright)

## 🤝 Contribution

Ce projet est une application éducative. N'hésitez pas à :
- Forker le projet
- Créer une branche (`git checkout -b feature/AmazingFeature`)
- Commit vos changements (`git commit -m 'Add AmazingFeature'`)
- Push (`git push origin feature/AmazingFeature`)
- Ouvrir une Pull Request

## 📄 Licence

MIT

## 👨‍💻 Auteur

Développé avec ❤️ pour les étudiants motivés

---

**Bon courage dans vos études ! 🎓📚**
