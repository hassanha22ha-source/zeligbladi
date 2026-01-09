# 🔐 ÉTAPES POUR DEVENIR ADMIN

## ⚠️ IMPORTANT : Vous devez faire ces étapes DANS L'ORDRE

### Étape 1 : Connexion Publique (PAS admin-login)
1. Allez sur : `http://localhost:3000/login` (login NORMAL, pas admin)
2. Connectez-vous avec :
   - Email : `admin2@terredezellige.com`
   - Mot de passe : (celui que vous avez créé)

### Étape 2 : Obtenir votre User ID
1. Une fois connecté, allez sur : `http://localhost:3000/admin/setup-orders`
2. Vous verrez une **boîte bleue** en haut qui dit "Promotion Admin (Urgence)"
3. Elle affichera votre User ID (quelque chose comme : `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)
4. Cliquez sur le bouton **"Copier"** pour copier le code SQL

### Étape 3 : Exécuter le SQL dans Supabase
1. Ouvrez un nouvel onglet : https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Cliquez sur **"SQL Editor"** dans le menu de gauche
4. Cliquez sur **"New Query"**
5. **COLLEZ** le code SQL que vous avez copié (ressemble à : `INSERT INTO admins (id) VALUES ('votre-id');`)
6. Cliquez sur **"Run"** ou appuyez sur `Ctrl+Enter`
7. Vous devriez voir : "Success. No rows returned"

### Étape 4 : Connexion Admin
Maintenant seulement, vous pouvez aller sur : `http://localhost:3000/admin-login`
- Email : `admin2@terredezellige.com`
- Mot de passe : (le même)

---

## ❌ Erreur Actuelle
Vous essayez d'accéder à `/admin-login` **AVANT** d'avoir exécuté le SQL.
C'est pourquoi vous voyez : "Accès refusé. Vous n'avez pas de droits administratifs."

## ✅ Solution
Suivez les étapes 1, 2, 3, puis 4 dans l'ordre.
