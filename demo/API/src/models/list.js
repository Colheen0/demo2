const mongoose = require("mongoose");

const MODELNAME = "list";

const Schema = new mongoose.Schema(
        {
            name: { type: String, required: true, trim: true },
            creation_time: { type: Date, default: Date.now },
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
        }, { timestamps: true }
    );

const OBJ = mongoose.model(MODELNAME, Schema);
module.exports = OBJ;