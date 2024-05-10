import { Model } from "mongoose";
import { CenshareLoadingMethods } from "../../models/censhare.model";

export type CenshareData = {
  username: string;
  password: string;
};

export type CenshareSchema = CenshareData & {
  user_id: string;
};

export type CenshareCombinedSchema = CenshareSchema & CenshareLoadingMethods;

export type CenshareCombinedModel = Model<CenshareCombinedSchema> &
  typeof CenshareLoadingMethods;

export type CenshareCombinedDocument = Document & CenshareCombinedSchema;
