import { Model } from "mongoose";
import { UserLoadingMethods } from "../../models/user.model";

export type UserSchema = {
  email: string;
  password: string;
};

export type UserCombinedSchema = UserSchema & UserLoadingMethods;

export type UserCombinedModel = Model<UserCombinedSchema> &
  typeof UserLoadingMethods;

export type UserCombinedDocument = Document & UserCombinedSchema;
