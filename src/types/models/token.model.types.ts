import { Model, Types } from "mongoose";
import { TokenLoadingMethods } from "../../models/token.model";

export type TokenSchema = {
  user_id: Types.ObjectId;
  refreshToken: string;
};

export type TokenCombinedSchema = TokenSchema & TokenLoadingMethods;

export type TokenCombinedModel = Model<TokenCombinedSchema> &
  typeof TokenLoadingMethods;

export type TokenCombinedDocument = Document & TokenCombinedSchema;
