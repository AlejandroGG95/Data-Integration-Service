"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.LoginInstanceSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    userName: String,
    password: String,
    remember: Boolean,
    accessToken: String,
    expiresIn: String
});
//# sourceMappingURL=login.schema.js.map