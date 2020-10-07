import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export const ClientInstanceSchema = new mongoose.Schema({
    name: String,
    jobs: [{
        name: String
    }]
});

export interface clientInstanceI extends Document {
    readonly name: String,
    readonly jobs: [{
        name: String
    }]
}