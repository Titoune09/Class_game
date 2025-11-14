# 🚀 Guide de Démarrage Rapide

## Installation

### 1. Installer les dépendances

```bash
npm install
```

### 2. Lancer l'application en développement

```bash
npm run dev
```

L'application sera accessible sur **http://localhost:3000**

### 3. Builder pour la production

```bash
npm run build
npm start
```

## 📱 Premier Lancement

### Étape 1 : Créer votre première matière

1. Allez sur l'onglet **Matières** (📚)
2. Cliquez sur **"+ Ajouter"**
3. Remplissez :
   - Nom : ex. "Mathématiques"
   - Choisissez une couleur
   - Choisissez une icône (optionnel)
4. Validez

### Étape 2 : Ajouter des chapitres

1. Cliquez sur la matière que vous venez de créer
2. Cliquez sur **"+ Ajouter chapitre"**
3. Remplissez :
   - Titre : ex. "Les dérivées"
   - Description (optionnel)
   - Priorité : Basse / Moyenne / Haute
   - Niveau de maîtrise : 0-5
   - Date d'examen (optionnel)
4. Validez

### Étape 3 : Planifier une session

1. Allez sur **Planning** (📅)
2. Cliquez sur **"Ajouter"** sous le jour souhaité
3. Choisissez :
   - Matière
   - Chapitre
   - Durée (15-120 min)
4. Validez

### Étape 4 : Lancer un Pomodoro

1. Allez sur **Pomodoro** (⏱️)
2. Choisissez un preset (25/5, 40/10, 50/10)
3. Cliquez sur **"Démarrer"**
4. Concentrez-vous ! ⚡

### Étape 5 : Utiliser le Mode Classe 🎓

**Avant le cours :**
1. Allez sur **Classe** (🎓)
2. Sélectionnez la matière et le chapitre
3. Choisissez 1-3 objectifs
4. Notez le micro-défi proposé
5. Cliquez sur **"Commencer le cours"**

**Pendant le cours :**
- Ajustez votre niveau d'attention (0-5)
- Cliquez sur "J'ai décroché" si distrait
- Utilisez "Note rapide" pour noter des idées
- Terminez quand le cours est fini

**Après le cours :**
- Donnez une note d'attention (0-10)
- Écrivez un résumé en une phrase
- Notez ce qu'il faut revoir
- Validez si vous avez réussi le défi
- Validez pour gagner de l'XP ! 🎯

## 🎮 Système de Progression

### XP et Niveaux

- **Pomodoro complété** : +10 XP
- **Session planning complétée** : +15 XP
- **Cours suivi** : +50-125 XP (selon évaluation)
- **Chapitre maîtrisé** : +20 XP
- **Streak maintenu** : +5 XP/jour
- **Badge débloqué** : +25 XP

**Formule niveau** : XP requis = 100 × niveau

### Badges

Il y a **18+ badges** à débloquer dans 5 catégories :

1. **Débutant** : Premiers pas
2. **Assiduité** : Streaks (3, 7, 30 jours)
3. **Pomodoro** : 10, 50, 100 timers
4. **Classe** : Attention, défis, perfection
5. **Maîtrise** : 5, 20, 50 chapitres maîtrisés

## 📊 Suivre vos Progrès

### Dans Statistiques (📊)

Vous trouverez :
- Votre niveau et XP total
- Minutes étudiées
- Répartition par matière
- Statistiques mode classe
- Tous vos badges

### Tips pour progresser

✅ **Faites au moins 1 Pomodoro par jour** → Maintient le streak  
✅ **Utilisez le mode classe** → Beaucoup d'XP  
✅ **Complétez vos sessions planning** → Organisation++  
✅ **Augmentez la maîtrise des chapitres** → Badges  
✅ **Soyez régulier** → Badges de streak  

## 🔧 Dépannage

### L'app ne charge pas

1. Ouvrez la console (F12)
2. Vérifiez les erreurs
3. Essayez : `localStorage.clear()` puis rechargez

### Mes données ont disparu

Les données sont en **localStorage** :
- Elles persistent tant que vous ne videz pas le cache
- Elles sont liées au domaine (localhost / production)
- Pas de sync entre appareils

### L'app est lente

1. Ouvrez la console
2. Vérifiez la taille localStorage :
   ```javascript
   let total = 0;
   for (let key in localStorage) {
     if (key.startsWith('app_')) {
       total += localStorage[key].length;
     }
   }
   console.log('Size:', (total / 1024).toFixed(2), 'KB');
   ```
3. Si > 4 MB, envisagez de supprimer l'historique ancien

### Build échoue

```bash
# Nettoyer le cache
rm -rf .next node_modules
npm install
npm run build
```

## 📱 Utilisation sur iPad

### Installation PWA (futur)

Pour l'instant, utilisez Safari :
1. Ouvrez l'app dans Safari
2. Cliquez sur "Partager"
3. "Sur l'écran d'accueil"
4. Confirmez

### Optimisations iPad

- ✅ Touch-friendly (boutons 44x44px minimum)
- ✅ Navigation bottom (zone pouce)
- ✅ Support paysage/portrait
- ✅ Pas de hover obligatoire
- ✅ Texte lisible (16px+)

## 🎯 Conseils d'Utilisation

### Pour les révisions

1. **Planifiez votre semaine** le dimanche soir
2. **Priorisez** les chapitres selon les dates d'examen
3. **Utilisez Pomodoro** pour rester concentré
4. **Suivez votre progression** dans Stats

### Pour les cours

1. **Préparez-vous** avec le mode classe (Phase 1)
2. **Restez attentif** pendant le cours (Phase 2)
3. **Évaluez immédiatement** après (Phase 3)
4. **Consultez vos notes rapides** plus tard

### Pour la motivation

1. **Consultez vos badges** régulièrement
2. **Visez le prochain niveau**
3. **Maintenez votre streak**
4. **Célébrez vos succès** 🎉

## 🚀 Déploiement Vercel

### Option 1 : Via Git

1. Pushez votre code sur GitHub
2. Connectez le repo à Vercel
3. Vercel build et déploie automatiquement

### Option 2 : Via CLI

```bash
npm install -g vercel
vercel
```

Suivez les instructions.

## 📝 Prochaines Étapes

Une fois à l'aise avec l'app :

1. **Ajoutez toutes vos matières**
2. **Complétez tous vos chapitres**
3. **Planifiez une semaine complète**
4. **Faites votre premier cours en mode classe**
5. **Débloquez vos premiers badges**
6. **Atteignez le niveau 5**

## 🆘 Besoin d'Aide ?

- Consultez le **README.md** complet
- Ouvrez une issue sur GitHub
- Consultez la console pour les erreurs

---

**Bon courage dans vos études ! 🎓📚✨**
