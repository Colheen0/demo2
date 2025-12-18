const express = require('express');
const router = express.Router();
const passport = require("passport");


const UserObject = require("../models/user")
const config = require("../config")
const jwt = require("jsonwebtoken");
const JWT_MAX_AGE = 60 * 60 * 24 * 7; // 7 jours

const SERVER_ERROR = "SERVER_ERROR"

router.post("/signin", async (req, res) => {
    let { password, login } = req.body;
    login = (login || "").trim().toLowerCase();
  
    if (!login || !password)
      return res.status(400).send({
        ok: false,
        code: "EMAIL_AND_PASSWORD_REQUIRED",
        message: "Email and password are required",
      });
  
    try {
      const user = await UserObject.findOne({ login });
  
      if (!user)
        return res.status(401).send({
          ok: false,
          code: "INVALID_USER",
          message: "Email or password is invalid",
        });
  
      const match =
        config.ENVIRONMENT === "development" ||
        (await user.comparePassword(password));
      if (!match)
        return res.status(401).send({
          ok: false,
          code: "EMAIL_OR_PASSWORD_INVALID",
          message: "Email or password is invalid",
        });
  
      user.set({ last_login_at: Date.now() });
      await user.save();
  
      const token = jwt.sign({ _id: user.id }, config.SECRET, {
        expiresIn: JWT_MAX_AGE,
      });
  
      return res.status(200).send({ ok: true, token, data: user });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ ok: false, code: "SERVER_ERROR" });
    }
  });

  router.post("/signup", async (req, res) => {
    let { password, login, name } = req.body;
    login = (login || "").trim().toLowerCase();
    name = (name || "").trim();
  
    if (!login || !password || !name)
      return res.status(400).send({
        ok: false,
        code: "MISSING_FIELDS",
        message: "Login, name and password are required",
      });
    
    try {
      const user = await UserObject.create({ password, login, name });
      console.log(user);

      return res.status(200).send({
        ok: true,
        message: "User created successfully",
        user
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        ok: false,
        code: "SERVER_ERROR",
        message: error.message
      });
    }
  });

  router.post("/test",async (req, res) => {
    console.log("req.body :", req.body);
    res.status(200).send("ok");
  }) 

  router.put(
    "/:id",
    async (req, res) => {
      try {
        let { old_password, new_login, new_password, new_name } = req.body;
        
        const userId = req.params.id;
        
        // Validation
        if (!old_password) {
          return res.status(400).send({
            ok: false,
            code: "OLD_PASSWORD_REQUIRED",
            message: "Old password is required for security"
          });
        }
        
        if (!new_login && !new_password && !new_name) {
          return res.status(400).send({
            ok: false,
            code: "INVALID_REQUEST",
            message: "At least one new value (login, name, or password) must be provided"
          });
        }
        
        // Get user
        const user = await UserObject.findById(userId);
        
        if (!user) {
          return res.status(404).send({
            ok: false,
            code: "USER_NOT_FOUND",
            message: "User not found"
          });
        }
        
        // Verify old password
        const passwordMatch = await user.comparePassword(old_password);
        
        if (!passwordMatch) {
          return res.status(401).send({
            ok: false,
            code: "INVALID_PASSWORD",
            message: "Old password is incorrect"
          });
        }
        
        // Prepare update data
        const updateData = {};
        
        if (new_login) {
          new_login = new_login.trim().toLowerCase();
          user.login = new_login;
        }
        
        if (new_name) {
          new_name = new_name.trim();
          user.name = new_name;
        }
        
        if (new_password) {
          user.password = new_password;
        }
        
        // Save user (this will trigger the pre-save hook for password hashing)
        const updatedUser = await user.save();
        
        res.status(200).send({ 
          ok: true,
          message: "User updated successfully",
          data: updatedUser 
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({ 
          ok: false, 
          code: "SERVER_ERROR", 
          error: error.message 
        });
      }
    }
  );

  router.get("/user", async (req, res) =>{
    let { login } = req.body;
    login = (login || "").trim().toLowerCase();

    const user = await UserObject.findOne({ login });
    console.log(user);
    res.status(200).send("C'est bon ça marche chef");
})

  // Nouvelle route pour récupérer un utilisateur par _id
  router.post("/get", async (req, res) => {
    const { _id } = req.body;
    if (!_id) {
      return res.status(400).send({
        ok: false,
        code: "ID_REQUIRED",
        message: "User ID is required"
      });
    }
    try {
      const user = await UserObject.findById(_id).select("-password");
      if (!user) {
        return res.status(404).send({
          ok: false,
          code: "USER_NOT_FOUND",
          message: "User not found"
        });
      }
      res.status(200).send({
        ok: true,
        user
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        ok: false,
        code: "SERVER_ERROR",
        message: error.message
      });
    }
  });

  router.delete("/delete_user/:id", async (req, res) => {
    try {
      const { _id } = req.body;
      
      if (!_id) {
        return res.status(400).send({
          ok: false,
          code: "ID_REQUIRED",
          message: "User ID is required"
        });
      }

      const userId = req.params.id || _id;
      
      const deletedUser = await UserObject.findByIdAndDelete(userId);
      
      if (!deletedUser) {
        return res.status(404).send({
          ok: false,
          code: "USER_NOT_FOUND",
          message: "User not found"
        });
      }
      
      res.status(200).send({
        ok: true,
        message: "User deleted successfully",
        user: deletedUser
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        ok: false,
        code: "SERVER_ERROR",
        message: error.message
      });
    }
  });
  
  module.exports = router;