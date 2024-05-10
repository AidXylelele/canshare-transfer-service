// @ts-nocheck
import mongoose, { Schema, SchemaTypes } from "mongoose";
import { UpdateWixData } from "../types/services/wix.service.types";
import { WixCombinedDocument, WixCombinedModel } from "../types/models/wix.model.types";

export class WixLoadingMethods {
  static findByUserId(user_id: string) {
    const filter = { user_id };
    return this.findOne(filter);
  }

  static update(user_id: string, data: UpdateWixData) {
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
  apiKey: { type: SchemaTypes.String, required: true },
  siteId: { type: SchemaTypes.String, required: true },
});

schema.loadClass(WixLoadingMethods);

export const Wix = mongoose.model<WixCombinedDocument, WixCombinedModel>("Wix", schema);
