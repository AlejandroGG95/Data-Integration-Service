import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export const FrecuenciaInstanceSchema = new mongoose.Schema({
    name: String,
    client: String,
    plan: {},
    next_: Date,
    arranque: String
});

export interface FrecuenciaInstanceI extends Document {
    name: String,
    client: String,
    plan: {},
    next_: Date,
    arranque: String
}