"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.UsersInstanceSchema = new mongoose.Schema({
    userId: Number,
    username: String,
    password: String
});
//# sourceMappingURL=users.schema.js.map