const express = require('express');
const router = express.Router();

const TaskObject = require("../models/task")
const config = require("../config")

const SERVER_ERROR = "SERVER_ERROR"

router.post("/ajout_task", async (req, res) => {
        try {
          let { name, listId } = req.body;
          name = (name || "").trim().toLowerCase();
      
          if (!name)
              return res.status(400).send({
                ok: false,
                code: "NAME_REQUIRED",
                message: "Your task need a name",
              });
          
          if (!listId)
              return res.status(400).send({
                ok: false,
                code: "LIST_ID_REQUIRED",
                message: "Your task need to be linked to a list",
              });
          
          // Récupérer l'utilisateur via la liste
          const ListObject = require("../models/list");
          const list = await ListObject.findById(listId);
          
          if (!list)
              return res.status(404).send({
                ok: false,
                code: "LIST_NOT_FOUND",
                message: "List not found",
              });
            
          const task = await TaskObject.create({
            name, 
            completer: false,
            list: listId, 
            user: list.user
          });
          console.log(task);
        
          return res.status(200).send({
            ok: true,
            message: "tâche ajouté",
            task
          });
        } catch (error) {
          res.status(500).send({
            ok: false,
            code: "SERVER_ERROR",
            message: error.message
          });
        }
    })

    router.get("/task", async (req, res) => {
        try {
          let { _id } = req.body;
      
          if (!_id)
              return res.status(400).send({
                ok: false,
                code: "ID_REQUIRED",
                message: "Task ID is required",
              });
      
          const task = await TaskObject.findById(_id);
          
          if (!task) {
              return res.status(404).send({
                ok: false,
                code: "TASK_NOT_FOUND",
                message: "Tâche introuvable"
              });
          }
      
          console.log(task);
          res.status(200).send({
              ok: true,
              message: "Tâche trouvée",
              task
          });
        } catch (error) {
          res.status(500).send({
              ok: false,
              code: "SERVER_ERROR",
              message: error.message
          });
        }
    })

    router.post("/tasks_by_list", async (req, res) => {
        try {
          let { listId } = req.body;
      
          if (!listId)
              return res.status(400).send({
                ok: false,
                code: "LIST_ID_REQUIRED",
                message: "List ID is required",
              });
      
          const tasks = await TaskObject.find({ list: listId });
          console.log(tasks);
          
          res.status(200).send({
              ok: true,
              message: "Tâches de la liste",
              count: tasks.length,
              tasks
          });
        } catch (error) {
          res.status(500).send({
              ok: false,
              code: "SERVER_ERROR",
              message: error.message
          });
        }
    })
    
    router.post("/delete_task", async (req, res) => {
        try {
          let { _id } = req.body;

          if (!_id)
              return res.status(400).send({
                ok: false,
                code: "ID_REQUIRED",
                message: "Task ID is required",
              });

          const task = await TaskObject.findByIdAndDelete(_id);
          if (!task) {
              return res.status(404).send({
                ok: false,
                code: "TASK_NOT_FOUND",
                message: "Tâche introuvable"
              });
          }
          console.log(task);
          res.status(200).send({
              ok: true,
              message: "La tâche est supprimée !",
              task
          });
        } catch (error) {
          res.status(500).send({
              ok: false,
              code: "SERVER_ERROR",
              message: error.message
          });
        }
    })

    router.patch("/update_task", async (req, res) => {
        try {
          let { _id, new_name, completer } = req.body;
          const updateFields = {};
          if (typeof new_name === 'string') {
            updateFields.name = new_name.trim().toLowerCase();
          }
          if (typeof completer === 'boolean') {
            updateFields.completer = completer;
          }
          if (!_id)
            return res.status(400).send({
              ok: false,
              code: "ID_REQUIRED",
              message: "Task ID is required",
            });
          if (!updateFields.name && completer === undefined)
            return res.status(400).send({
              ok: false,
              code: "NO_UPDATE",
              message: "No update fields provided",
            });
          const updatedTask = await TaskObject.findByIdAndUpdate(
            _id,
            updateFields,
            { new: true }
          );
          if (!updatedTask) {
            return res.status(404).send({
              ok: false,
              code: "TASK_NOT_FOUND",
              message: "Tâche introuvable"
            });
          }
          res.status(200).json({
            ok: true,
            message: "La tâche a été modifiée !",
            updatedTask
          });
        } catch (error) {
          res.status(500).json({ 
            ok: false,
            code: "SERVER_ERROR",
            error: error.message 
          });
        }
    });

module.exports = router;