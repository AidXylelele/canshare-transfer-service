import { Model } from "mongoose";
import { UriLoadingMethods } from "../models/uri.model";

export type UriData = {
  upload: string;
  update: string;
  delete: string;
};

export type UpdateUriData = {
  [key: string]: string;
};

export type UriSchema = UriData & {
  user_id: string;
};

export type UriCombinedSchema = UriSchema & UriLoadingMethods;

export type UriCombinedModel = Model<UriCombinedSchema> &
  typeof UriLoadingMethods;

export type UriCombinedDocument = Document & UriCombinedSchema;
