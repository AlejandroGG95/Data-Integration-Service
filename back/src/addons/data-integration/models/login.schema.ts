import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export const LoginInstanceSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    userName: String,
    password: String,
    remember: Boolean,
    accessToken: String,
    expiresIn: String
});

export interface LoginInstanceI extends Document {
    _id: mongoose.Types.ObjectId,
    userName: String,
    password: String,
    remember: Boolean,
    accessToken: String,
    expiresIn: String
}