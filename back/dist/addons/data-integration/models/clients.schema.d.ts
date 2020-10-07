import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
export declare const ClientInstanceSchema: mongoose.Schema<any>;
export interface clientInstanceI extends Document {
    readonly name: String;
    readonly jobs: [{
        name: String;
    }];
}
