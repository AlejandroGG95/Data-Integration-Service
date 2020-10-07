"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.FrecuenciaInstanceSchema = new mongoose.Schema({
    name: String,
    client: String,
    plan: {},
    next_: Date,
    arranque: String
});
//# sourceMappingURL=frecuencia.schema.js.map