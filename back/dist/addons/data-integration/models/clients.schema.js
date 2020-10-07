"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.ClientInstanceSchema = new mongoose.Schema({
    name: String,
    jobs: [{
            name: String
        }]
});
//# sourceMappingURL=clients.schema.js.map