import { Model } from "mongoose";
import { WixLoadingMethods } from "../../models/wix.model";

export type WixData = {
  apiKey: string;
  siteId: string;
};

export type WixSchema = WixData & {
  user_id: string;
};

export type WixCombinedSchema = WixSchema & WixLoadingMethods;

export type WixCombinedModel = Model<WixCombinedSchema> & typeof WixLoadingMethods;

export type WixCombinedDocument = Document & WixCombinedSchema;
