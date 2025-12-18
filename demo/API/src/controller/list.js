const express = require('express');
const router = express.Router();

const ListObject = require("../models/list")
const config = require("../config")

const SERVER_ERROR = "SERVER_ERROR"

router.post("/ajout_list", async (req, res) => {
    let { name, user } = req.body;
    name = (name || "").trim().toLowerCase();

    if (!name)
        return res.status(400).send({
          ok: false,
          code: "NAME_REQUIRED",
          message: "Your list need a name",
        });
      const list = await ListObject.create({name, user});
      console.log(list);
  
      return res.status(200).send({
     message: "liste ajouté",
     list
    });

})

router.post("/list", async (req, res) =>{
        let { user } = req.body;
    
        if (!user)
            return res.status(400).send({
                ok: false,
                message: "User ID required"
            });
    
        const lists = await ListObject.find({ user });
        console.log(lists);
        res.status(200).send({
            message: "Listes de l'utilisateur",
            lists
        });
    }) 


    router.post("/delete_list", async (req, res) =>{
            let { _id } = req.body;
        
            const list = await ListObject.findOneAndDelete({ _id });
            console.log(list);
            res.status(200).send({
              message: "C'est bon ! La liste est supprimée !",
              name: list?.name,
              user: list?.user
        });
        })

        router.patch("/update_list", async (req, res) => {
            try {
              let { _id, new_name } = req.body;
              new_name = (new_name || "").trim().toLowerCase();
          
              if (!_id)
                return res.status(400).send({
                  ok: false,
                  code: "ID_REQUIRED",
                  message: "List ID is required",
                });
          
              if (!new_name)
                return res.status(400).send({
                  ok: false,
                  code: "NAME_REQUIRED",
                  message: "New list name is required",
                });
          
              const updatedList = await ListObject.findByIdAndUpdate(
                _id,
                { name: new_name },
                { new: true }
              );
          
              if (!updatedList) {
                return res.status(404).send({
                  ok: false,
                  code: "LIST_NOT_FOUND",
                  message: "Liste introuvable"
                });
              }
          
              res.status(200).json({
                ok: true,
                message: "Le nom de la liste a été modifié !",
                updatedList
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