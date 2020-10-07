import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export const UsersInstanceSchema = new mongoose.Schema({
  userId: Number,
  username: String,
  password: String
});

export interface usersInstanceI extends Document {
  readonly userId: Number,
  readonly username: String,
  readonly password: String
}