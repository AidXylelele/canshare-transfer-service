import Joi from "joi";
import { RawAssetLinkVariants } from "../consts/asset.const";

const RawAssetDateSchema = Joi.object({
  von: Joi.string().required(),
  bis: Joi.string().required(),
});

const RawAssetLinkData = Joi.object({
  variants: Joi.object({
    master: Joi.object({
      size: Joi.number().required(),
      link: Joi.string().required(),
      width: Joi.number().optional(),
      type: Joi.string().required(),
      height: Joi.number().optional(),
    }).required(),
  }).required(),
});

export const RawAssetSchema = Joi.object({
  assetId: Joi.number().required(),
  name: Joi.string().required(),
  gueltigkeit: RawAssetDateSchema.required(),
  veroeffentlichung: RawAssetDateSchema.required(),
  masterdata: RawAssetLinkData,
  jpg_300dpi: RawAssetLinkData,
  jpg_300dpi_600x600: RawAssetLinkData,
})
  .unknown()
  .or(...RawAssetLinkVariants);
