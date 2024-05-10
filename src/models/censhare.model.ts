// @ts-nocheck
import mongoose, { Schema, SchemaTypes } from "mongoose";
import { UpdateCenshareData } from "../types/services/censhare.service.types";
import {
  CenshareCombinedDocument,
  CenshareCombinedModel,
} from "../types/models/censhare.model.types";

export class CenshareLoadingMethods {
  static findByUserId(user_id: string) {
    const filter = { user_id };
    return this.findOne(filter);
  }

  static update(user_id: string, data: UpdateCenshareData) {
    const filter = { user_id };
    const projection = {};

    for (const field in data) {
      projection[field] = 1;
    }

    const options = { new: true, projection };
    return this.findOneAndUpdate(filter, data, options);
  }

  static delete(user_id: string) {
    const conditions = { user_id };
    return this.findOneAndDelete(conditions);
  }
}

const schema = new Schema({
  user_id: {
    type: SchemaTypes.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  username: { type: SchemaTypes.String, required: true },
  password: { type: SchemaTypes.String, required: true },
});

schema.loadClass(CenshareLoadingMethods);

export const Censhare = mongoose.model<CenshareCombinedDocument, CenshareCombinedModel>(
  "Censhare",
  schema,
);
