import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
export declare const UsersInstanceSchema: mongoose.Schema<any>;
export interface usersInstanceI extends Document {
    readonly userId: Number;
    readonly username: String;
    readonly password: String;
}
