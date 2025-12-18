📱 TodoList (Mobile + API)

Une application mobile complète réalisée avec React Native (Expo) et une API Node.js/Express/MongoDB. L'application permet aux utilisateurs de gérer leurs listes de tâches personnelles et inclut un panneau d'administration sécurisé.

📂 Structure du Projet
Assure-toi que ton projet est organisé ainsi (ou adapte les commandes ci-dessous) :

/api : Le code du serveur (Backend)

/mobile (ou le nom de ton dossier expo) : Le code de l'application mobile (Frontend)

🛠️ 1. Installation & Lancement de l'API (Backend)
Ce serveur gère la base de données, l'authentification JWT et la logique métier.

📍 Dans le dossier /api
Installer les dépendances : Ouvre un terminal dans le dossier api et lance :

Bash

npm install express mongoose jsonwebtoken cors nodemon dotenv
Configuration (config.js ou .env) : Assure-toi d'avoir configuré ta connexion MongoDB et ta clé secrète JWT. Exemple dans config.js :

JavaScript

module.exports = {
  PORT: 3000,
  MONGO_URI: "mongodb://localhost:27017/todo-app", // Ou ton lien Atlas
  SECRET: "MA_SUPER_CLE_SECRETE_JWT"
};
Lancer le serveur :

Bash

npm run dev
# ou
nodemon src/index.js
✅ Le serveur doit tourner sur le port 3000.

📱 2. Installation & Lancement de l'Application (Frontend)
L'application mobile construite avec Expo.

📍 Dans le dossier /app
Installer les dépendances : Ouvre un terminal dans le dossier de ton application et lance :

Bash

npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants
npm install apisauce @react-native-async-storage/async-storage @expo/vector-icons
⚠️ IMPORTANT : Configuration IP Ouvre le fichier src/api.js (ou api.ts). Remplace l'adresse IP par l'adresse IP locale de ton ordinateur

JavaScript

// api.js
// il faut utiliser l'IP locale de l'ordinateur qui fait le serveur (ex: 192.168.1.XX)
const API_BASE_URL = 'http://192.168.1.15:3000'; 
Lancer l'application :

Bash

npx expo start
Scanne le QR Code avec ton téléphone (via Expo Go).

Ou appuie sur a pour lancer sur émulateur Android, i pour iOS.

🔐 Configuration Administrateur
Pour accéder au panneau d'administration, une sécurité par ID est en place.

Inscris-toi normalement via l'application.

Va dans ta base de données MongoDB et récupère l' _id de ton utilisateur.

Ouvre les fichiers app/admin.tsx (Frontend) et controllers/user.js (Backend).

Mets à jour la constante ADMIN_ID avec ton ID :

JavaScript

const ADMIN_ID = "ID_DE L'ADMIN_MONGODB_ICI";
Lors de ta prochaine connexion avec ce compte, tu seras automatiquement redirigé vers l'interface Admin.

✨ Fonctionnalités
👤 Pour les Utilisateurs (User)
Authentification :

Inscription et Connexion sécurisée.

Auto-login : L'application se souvient de toi si tu quittes sans te déconnecter.

Gestion des Listes :

Créer une nouvelle liste.

Voir toutes ses listes personnelles.

Modifier le nom d'une liste (Appui long).

Supprimer une liste (Supprime aussi les tâches associées).

Gestion des Tâches :

Ajouter une tâche dans une liste.

Cocher/Décocher une tâche (Barre de progression visuelle).

Modifier le nom d'une tâche (Appui long).

Supprimer une tâche.

Profil :

Voir ses informations (Nom, Email).

Modifier ses informations (Appui long).

Se déconnecter.

🛡️ Pour l'Administrateur (Admin)
Redirection automatique : Accès exclusif à une interface dédiée dès la connexion.

Gestion Globale :

Voir la liste de tous les utilisateurs inscrits.

Actions Admin :

Modifier le nom ou l'email de n'importe quel utilisateur (via appui long).

Supprimer un utilisateur : Supprime l'utilisateur ainsi que toutes ses listes et tâches en cascade (Nettoyage complet de la BDD).

Sécurité :

Protection contre la suppression de son propre compte Admin.

Routes API sécurisées : Seul l'admin peut appeler la route "Get All Users" ou supprimer un autre compte.
