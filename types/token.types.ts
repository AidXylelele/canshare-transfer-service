import { TokenLoadingMethods } from "../models/token.model";
import { Document, Model, Types } from "mongoose";

export type TokenOptions = {
  secret: string;
  expiresIn: string;
};

export type TokenSchema = {
  user_id: Types.ObjectId;
  refreshToken: string;
};

export type TokenCombinedSchema = TokenSchema & TokenLoadingMethods;

export type TokenCombinedModel = Model<TokenCombinedSchema> &
  typeof TokenLoadingMethods;

export type TokenCombinedDocument = Document & TokenCombinedSchema;
