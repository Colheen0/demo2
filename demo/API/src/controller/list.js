const express = require('express');
const router = require('express').Router();
const ListObject = require("../models/list");
const auth = require("../middlewares/auth");

// 1. AJOUTER UNE LISTE
router.post("/ajout_list", auth, async (req, res) => {
    try {
        let { name } = req.body;
        const userId = req.auth.userId; 

        name = (name || "").trim().toLowerCase();
        if (!name) {
            return res.status(400).send({ ok: false, message: "Le nom de la liste est requis" });
        }

        const list = await ListObject.create({ 
            name, 
            user: userId 
        });

        return res.status(200).send({ ok: true, message: "Liste ajoutée", list });
    } catch (error) {
        res.status(500).send({ ok: false, message: error.message });
    }
});

// 2. RÉCUPÉRER TOUTES LES LISTES DE L'UTILISATEUR CONNECTÉ
router.get("/my-lists", auth, async (req, res) => {
    try {
        const userId = req.auth.userId;

        // On ne cherche que les listes de CET utilisateur
        const lists = await ListObject.find({ user: userId });
        
        res.status(200).send({
            ok: true,
            message: "Vos listes ont été récupérées",
            lists
        });
    } catch (error) {
        res.status(500).send({ ok: false, message: error.message });
    }
});

// 3. SUPPRIMER UNE LISTE
router.post("/delete_list", auth, async (req, res) => {
    try {
        const { _id } = req.body;
        const userId = req.auth.userId;

        // On ne peut supprimer que si la liste nous appartient
        const list = await ListObject.findOneAndDelete({ _id: _id, user: userId });

        if (!list) {
            return res.status(404).send({ ok: false, message: "Liste introuvable ou accès refusé" });
        }

        res.status(200).send({
            ok: true,
            message: "La liste est supprimée !",
            name: list.name
        });
    } catch (error) {
        res.status(500).send({ ok: false, message: error.message });
    }
});

// 4. MODIFIER UNE LISTE
router.patch("/update_list", auth, async (req, res) => {
    try {
        let { _id, new_name } = req.body;
        const userId = req.auth.userId;
        
        new_name = (new_name || "").trim().toLowerCase();

        if (!_id || !new_name) {
            return res.status(400).send({ ok: false, message: "ID et nouveau nom requis" });
        }

        // On met à jour seulement si la liste appartient à l'utilisateur
        const updatedList = await ListObject.findOneAndUpdate(
            { _id: _id, user: userId },
            { name: new_name },
            { new: true }
        );

        if (!updatedList) {
            return res.status(404).send({ ok: false, message: "Liste introuvable" });
        }

        res.status(200).json({ ok: true, message: "Liste modifiée !", updatedList });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
});

module.exports = router;