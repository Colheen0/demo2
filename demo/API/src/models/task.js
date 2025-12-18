const mongoose = require("mongoose");

const MODELNAME = "task";

const Schema = new mongoose.Schema(
        {
            name: { type: String, required: true, trim: true },
            completer: { type: Boolean, default: false },
            creation_time: { type: Date, default: Date.now },
            user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
            list: { type: mongoose.Schema.Types.ObjectId, ref: "List", required: true }
        }, { timestamps: true }

    );

const OBJ = mongoose.model(MODELNAME, Schema);
module.exports = OBJ;