import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
export declare const FrecuenciaInstanceSchema: mongoose.Schema<any>;
export interface FrecuenciaInstanceI extends Document {
    name: String;
    client: String;
    plan: {};
    next_: Date;
    arranque: String;
}
