// @ts-nocheck

import mongoose, { Schema, SchemaTypes } from "mongoose";
import {
  CheckpointCombinedDocument,
  CheckpointCombinedModel,
} from "../types/checkpoint.types";

export class CheckpointLoadingMethods {
  static find(user_id: string) {
    const filter = { user_id };
    return this.findOne(filter);
  }

  static update(user_id: string, isFinished: boolean) {
    const conditions = { user_id };
    const update = { isFinished };

    return this.findOneAndUpdate(conditions, update);
  }
}

const schema = new Schema({
  user_id: {
    type: SchemaTypes.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  isFinished: { type: SchemaTypes.Boolean, default: false },
});

schema.loadClass(CheckpointLoadingMethods);

export const Checkpoint = mongoose.model<
  CheckpointCombinedDocument,
  CheckpointCombinedModel
>("Checkpoint", schema);
