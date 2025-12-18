const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const UserObject = require("../models/user");
const config = require("../config");
const auth = require("../middlewares/auth"); // <--- On importe ton middleware

const JWT_MAX_AGE = 60 * 60 * 24 * 7; // 7 jours

// 1. LOGIN (Public - Génère le badge)
router.post("/signin", async (req, res) => {
    let { password, login } = req.body;
    login = (login || "").trim().toLowerCase();
  
    if (!login || !password)
      return res.status(400).send({ ok: false, code: "EMAIL_AND_PASSWORD_REQUIRED" });
  
    try {
      const user = await UserObject.findOne({ login });
      if (!user) return res.status(401).send({ ok: false, code: "INVALID_USER" });
  
      const match = config.ENVIRONMENT === "development" || (await user.comparePassword(password));
      if (!match) return res.status(401).send({ ok: false, code: "EMAIL_OR_PASSWORD_INVALID" });
  
      user.set({ last_login_at: Date.now() });
      await user.save();
  
      // Utilisation de config.SECRET pour signer
      const token = jwt.sign({ _id: user.id }, config.SECRET, { expiresIn: JWT_MAX_AGE });
  
      return res.status(200).send({ ok: true, token, data: user });
    } catch (error) {
      return res.status(500).send({ ok: false, code: "SERVER_ERROR" });
    }
});

// 2. SIGNUP (Public)
router.post("/signup", async (req, res) => {
    let { password, login, name } = req.body;
    try {
      const user = await UserObject.create({ password, login, name });
      return res.status(200).send({ ok: true, message: "User created", user });
    } catch (error) {
      return res.status(500).send({ ok: false, code: "SERVER_ERROR", message: error.message });
    }
});

// 3. UPDATE USER (Protégé par 'auth')
router.put("/:id", auth, async (req, res) => {
    try {
        const userIdFromParams = req.params.id;
        const userIdFromToken = req.auth.userId; // Récupéré du badge !

        // SÉCURITÉ : Un utilisateur ne peut pas modifier un autre compte
        if (userIdFromParams !== userIdFromToken) {
            return res.status(403).send({ ok: false, message: "Vous n'avez pas le droit de modifier ce profil" });
        }

        let { old_password, new_login, new_password, new_name } = req.body;
        const user = await UserObject.findById(userIdFromParams);
        
        if (!user) return res.status(404).send({ ok: false, message: "User not found" });
        
        const passwordMatch = await user.comparePassword(old_password);
        if (!passwordMatch) return res.status(401).send({ ok: false, message: "Old password incorrect" });

        if (new_login) user.login = new_login.trim().toLowerCase();
        if (new_name) user.name = new_name.trim();
        if (new_password) user.password = new_password;

        const updatedUser = await user.save();
        res.status(200).send({ ok: true, data: updatedUser });
    } catch (error) {
        res.status(500).send({ ok: false, error: error.message });
    }
});

// 4. DELETE USER (Protégé par 'auth')
router.delete("/delete_user/:id", auth, async (req, res) => {
    try {
        const userIdFromParams = req.params.id;
        const userIdFromToken = req.auth.userId;

        // SÉCURITÉ : Un utilisateur ne peut supprimer que son propre compte
        if (userIdFromParams !== userIdFromToken) {
            return res.status(403).send({ ok: false, message: "Action interdite" });
        }

        const deletedUser = await UserObject.findByIdAndDelete(userIdFromParams);
        if (!deletedUser) return res.status(404).send({ ok: false, message: "User not found" });
        
        res.status(200).send({ ok: true, message: "User deleted" });
    } catch (error) {
        res.status(500).send({ ok: false, message: error.message });
    }
});

module.exports = router;