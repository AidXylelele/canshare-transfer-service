import Joi from "joi";
import { RawAsset } from "../../types/external/asset.types";
import { FilterTool } from "./filter.tool";
import { RawAssetSchema } from "../../validation/asset.schema";
import { OperationResult } from "../../dto/operationResult.dto";

export class ValidatorTool {
  private schema: Joi.Schema;
  private filterTool: FilterTool;

  constructor() {
    this.schema = RawAssetSchema;
    this.filterTool = new FilterTool();
  }

  private checkDataTypeMaintance(rawAsset: RawAsset) {
    const collectionId = this.filterTool.getCollectionId(rawAsset);
    return collectionId ? true : false;
  }

  private checkSizeMaintance(rawAsset: RawAsset) {
    const collectionSizeLimit = this.filterTool.getCollectionSizeLimit(rawAsset);
    const masterData = this.filterTool.getVariantMasterData(rawAsset);

    if (!masterData || !masterData.size) return false;

    return collectionSizeLimit >= masterData.size ? true : false;
  }

  validate(rawAssets: RawAsset[]) {
    const action = "Metadata validation";
    const operationResult = new OperationResult<RawAsset>(action);

    for (const rawAsset of rawAssets) {
      const isDataTypeMaintained = this.checkDataTypeMaintance(rawAsset);
      const isSizeMaintained = this.checkSizeMaintance(rawAsset);
      const schemaValidation = this.schema.validate(rawAsset);

      if (schemaValidation.error || !isDataTypeMaintained || !isSizeMaintained) {
        const message = schemaValidation.error ? "Metadata is not valid" : "File is not supported";
        operationResult.fail(rawAsset, message);
      } else {
        operationResult.success(rawAsset);
      }
    }

    return operationResult;
  }
}
