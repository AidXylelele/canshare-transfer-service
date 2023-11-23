// @ts-nocheck

import mongoose, { Schema, SchemaTypes } from "mongoose";
import {
  TokenCombinedDocument,
  TokenCombinedModel,
} from "../types/token.types";

export class TokenLoadingMethods {
  static update(user_id: string, refreshToken: string) {
    const conditions = { user_id };
    const update = { refreshToken };
    return this.findOneAndUpdate(conditions, update);
  }
  static getByUserId(user_id: string) {
    const filter = { user_id };
    return this.findOne(filter);
  }
}

const schema = new Schema({
  user_id: {
    type: SchemaTypes.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  refreshToken: { type: SchemaTypes.String, required: true, unique: true },
});

schema.loadClass(TokenLoadingMethods);

export const Token = mongoose.model<TokenCombinedDocument, TokenCombinedModel>(
  "Token",
  schema
);
