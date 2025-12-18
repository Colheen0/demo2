const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const MODELNAME = "user"

const Schema = new mongoose.Schema(
    {
      login: { type: String, required: true, trim: true },
      name: { type: String, required: true, trim: true },
      password: String,
      last_login_at: { type: Date, default: Date.now },
    },
    { timestamps: true }
  );

// Hashage du mot de passe avant sauvegarde
Schema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// comparaison des mots de passe
Schema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const OBJ = mongoose.model(MODELNAME, Schema);
module.exports = OBJ;