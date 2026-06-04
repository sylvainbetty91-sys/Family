# 🥃 Rhum Danou — Site Web Officiel

Site de vente en ligne pour **Rhum Danou Distilling** — déployable sur GitHub + Render.

## 🚀 Déploiement sur Render

### Étape 1 — GitHub
1. Crée un repo GitHub (ex: `rhumdanou-site`)
2. Upload tous les fichiers de ce dossier dans le repo
3. Assure-toi que `logo.jpg` et `hero.jpg` sont dans le dossier `public/`

### Étape 2 — Render
1. Va sur [render.com](https://render.com) → New → Web Service
2. Connecte ton repo GitHub
3. Paramètres :
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
   - **Node version** : 18+
4. Variables d'environnement à ajouter :
   - `SESSION_SECRET` → une chaîne aléatoire longue (ex: `rhumdanou2024supersecret`)
   - `NODE_ENV` → `production`
5. **Disk** (pour garder les uploads) :
   - Mount Path: `/opt/render/project/src/public/uploads`
   - Size: 5 GB
6. Clique **Deploy** ✅

---

## 🔐 Compte Créateur
- **Email** : TeamDanouofficiel@gmail.com
- **Mot de passe** : Danou_Family&509

## 👥 Rôles
| Rôle | Capacités |
|------|-----------|
| **Créateur** (Danou) | Tout + promouvoir/supprimer admins |
| **Admin** | Publier, modifier, supprimer posts, bannir users |
| **Utilisateur** | Voir, commenter, aimer, acheter |

## 🛒 Fonctionnement Boutique
- Chaque sélection = **×3 unités** automatiquement dans le panier
- Le total est calculé automatiquement (HTG / USD)
- Commande envoyée vers WhatsApp **+50933324695**

## 📱 Fonctionnalités
- ✅ Page d'accueil avec logo + image hero
- ✅ Connexion / Inscription (Gmail + mot de passe)
- ✅ Feed style Instagram (photos + vidéos)
- ✅ Badge prix sur les publications
- ✅ Multi-photos/vidéos par publication
- ✅ Modifier une publication (prix, description, médias)
- ✅ Compteur de vues (visible admins seulement)
- ✅ Panier avec total HTG/USD
- ✅ Commande via WhatsApp (message pré-rédigé)
- ✅ Bot de support automatique
- ✅ Gestion des utilisateurs (bannir, promouvoir)
- ✅ Supprimer commentaires

## 🔧 Structure
```
rhumdanou/
├── server/
│   └── index.js          ← Serveur Express + API
├── public/
│   ├── index.html         ← Frontend complet
│   ├── logo.jpg           ← Ton logo
│   ├── hero.jpg           ← Image d'accueil
│   └── uploads/           ← Photos/vidéos publiées
├── package.json
├── render.yaml
└── .gitignore
```

## ⚠️ Note Production
Actuellement les données sont **en mémoire** (se réinitialisent au redémarrage).
Pour une vraie base de données persistante, ajouter **MongoDB Atlas** (gratuit) ou **PostgreSQL** sur Render.
