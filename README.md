# Mini-jeux discrets 🕹️

Une collection de mini-jeux discrets parfaits pour les cours, avec un mode furtif et des statistiques locales.

## Fonctionnalités

- **6 Mini-jeux** : Clicker, Doodle, Typing, Memory, Snake, 2048
- **Mode discret** : Appuyez sur `!` pour passer en mode notes plein écran
- **Thème sombre/clair** : Appuyez sur `d` pour basculer
- **Statistiques locales** : Vos records sont sauvegardés
- **Raccourcis clavier** : Navigation rapide avec les touches 1-7
- **Responsive** : Fonctionne sur mobile et desktop

## Raccourcis clavier

- `1-7` : Changer d'onglet
- `d` : Basculer thème sombre/clair
- `!` : Mode discret (notes plein écran)
- `P` : Pause/Reprendre (Snake)
- `R` : Reset (Snake)
- `S` : Screenshot

## Déploiement sur Vercel

1. Connectez votre repository GitHub à Vercel
2. Vercel détectera automatiquement que c'est un projet Next.js
3. Le déploiement se fera automatiquement

### Déploiement manuel

```bash
# Installer les dépendances
npm install

# Build pour la production
npm run build

# Démarrer en mode production
npm start
```

## Développement local

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Technologies utilisées

- **Next.js 14** - Framework React
- **React 18** - Bibliothèque UI
- **Tailwind CSS** - Framework CSS
- **TypeScript** - Typage statique
- **Vercel** - Plateforme de déploiement

## Structure du projet

```
├── components/
│   └── FunSite.jsx          # Composant principal
├── pages/
│   ├── _app.js              # Configuration Next.js
│   └── index.js             # Page d'accueil
├── styles/
│   └── globals.css          # Styles globaux + Tailwind
├── package.json             # Dépendances
├── next.config.js           # Configuration Next.js
├── tailwind.config.js       # Configuration Tailwind
├── vercel.json              # Configuration Vercel
└── README.md
```

## Améliorations apportées

- ✅ Structure Next.js optimisée pour Vercel
- ✅ Configuration TypeScript et ESLint
- ✅ Tailwind CSS pour les styles
- ✅ Responsive design amélioré
- ✅ Optimisations de performance
- ✅ Gestion des erreurs SSR
- ✅ Configuration Vercel optimisée

Profitez de vos mini-jeux discrets ! 🎮