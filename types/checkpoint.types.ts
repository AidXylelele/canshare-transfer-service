import { Model, Types } from "mongoose";
import { CheckpointLoadingMethods } from "../models/checkpoint.model";

export type Checkpoint = {
  user_id: string;
  isFinished?: boolean;
};

export type CheckpointSchema = {
  user_id: Types.ObjectId;
  isFinished: boolean;
};

export type CheckpointCombinedSchema = CheckpointSchema &
  CheckpointLoadingMethods;

export type CheckpointCombinedModel = Model<CheckpointCombinedSchema> &
  typeof CheckpointLoadingMethods;

export type CheckpointCombinedDocument = Document & CheckpointCombinedSchema;
