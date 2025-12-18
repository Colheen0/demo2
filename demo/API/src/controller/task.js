const express = require('express');
const router = express.Router();
const TaskObject = require("../models/task");
const ListObject = require("../models/list"); 
const auth = require("../middlewares/auth"); 

// 1. AJOUTER UNE TÂCHE
router.post("/ajout_task", auth, async (req, res) => {
    try {
        let { name, listId } = req.body;
        const userId = req.auth.userId;

        name = (name || "").trim().toLowerCase();
        if (!name || !listId) {
            return res.status(400).send({ ok: false, message: "Nom et ID de liste requis" });
        }

        // SÉCURITÉ : On vérifie que la liste appartient bien à l'utilisateur connecté
        const list = await ListObject.findOne({ _id: listId, user: userId });
        if (!list) {
            return res.status(403).send({ ok: false, message: "Liste introuvable ou accès refusé" });
        }

        const task = await TaskObject.create({
            name,
            completer: false,
            list: listId,
            user: userId 
        });

        return res.status(200).send({ ok: true, message: "Tâche ajoutée", task });
    } catch (error) {
        res.status(500).send({ ok: false, code: "SERVER_ERROR", message: error.message });
    }
});

// 2. RÉCUPÉRER UNE TÂCHE PRÉCISE
router.post("/get_task", auth, async (req, res) => {
    try {
        const { _id } = req.body;
        const userId = req.auth.userId;

        // On ne renvoie que si la tâche appartient à cet utilisateur
        const task = await TaskObject.findOne({ _id: _id, user: userId });
        
        if (!task) {
            return res.status(404).send({ ok: false, message: "Tâche introuvable" });
        }

        res.status(200).send({ ok: true, task });
    } catch (error) {
        res.status(500).send({ ok: false, message: error.message });
    }
});

// 3. RÉCUPÉRER TOUTES LES TÂCHES D'UNE LISTE
router.post("/tasks_by_list", auth, async (req, res) => {
    try {
        const { listId } = req.body;
        const userId = req.auth.userId;

        // On ne renvoie que les tâches qui appartiennent à cet utilisateur
        const tasks = await TaskObject.find({ list: listId, user: userId });
        
        res.status(200).send({ ok: true, count: tasks.length, tasks });
    } catch (error) {
        res.status(500).send({ ok: false, message: error.message });
    }
});

// 4. SUPPRIMER UNE TÂCHE
router.post("/delete_task", auth, async (req, res) => {
    try {
        const { _id } = req.body;
        const userId = req.auth.userId;

        // On ne peut supprimer que si la tâche nous appartient
        const task = await TaskObject.findOneAndDelete({ _id: _id, user: userId });

        if (!task) {
            return res.status(404).send({ ok: false, message: "Tâche introuvable ou accès refusé" });
        }

        res.status(200).send({ ok: true, message: "La tâche est supprimée !" });
    } catch (error) {
        res.status(500).send({ ok: false, message: error.message });
    }
});

// 5. MODIFIER UNE TÂCHE (Nom ou statut complété)
router.patch("/update_task", auth, async (req, res) => {
    try {
        let { _id, new_name, completer } = req.body;
        const userId = req.auth.userId;

        const updateFields = {};
        if (typeof new_name === 'string') updateFields.name = new_name.trim().toLowerCase();
        if (typeof completer === 'boolean') updateFields.completer = completer;

        // findOneAndUpdate avec le filtre user
        const updatedTask = await TaskObject.findOneAndUpdate(
            { _id: _id, user: userId },
            updateFields,
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).send({ ok: false, message: "Tâche introuvable" });
        }

        res.status(200).json({ ok: true, message: "La tâche a été modifiée !", updatedTask });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
});

module.exports = router;