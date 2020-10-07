import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
export declare const LoginInstanceSchema: mongoose.Schema<any>;
export interface LoginInstanceI extends Document {
    _id: mongoose.Types.ObjectId;
    userName: String;
    password: String;
    remember: Boolean;
    accessToken: String;
    expiresIn: String;
}
