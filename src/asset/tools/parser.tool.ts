import { Map } from "../../types/common.types";
import { ObjectHelpers } from "../../helpers/object.helpers";
import { FlattenObject } from "../../types/external/messages/parser.message.types";
import { Asset, RawAsset } from "../../types/external/asset.types";
import { RawAssetTranslation } from "../../consts/asset.const";

export class ParserTool {
  private translationMap: Map;
  private objectHelpers: ObjectHelpers;

  constructor() {
    this.objectHelpers = new ObjectHelpers();
    this.translationMap = RawAssetTranslation;
  }

  private translateRawAsset(obj: FlattenObject): FlattenObject {
    const result: FlattenObject = {};
    const entries = Object.entries(obj);

    for (const entry of entries) {
      const [flattenKey, value] = entry;
      const translatedKey = this.translationMap[flattenKey];

      if (!translatedKey) continue;

      result[translatedKey] = value;
    }

    return result;
  }

  parse(rawAssets: RawAsset[]): Asset[] {
    const translated = [];

    for (const rawAsset of rawAssets) {
      const flattenRawAsset = this.objectHelpers.flatten(rawAsset);
      const asset = this.translateRawAsset(flattenRawAsset);
      translated.push(asset as Asset);
    }

    return translated;
  }
}
