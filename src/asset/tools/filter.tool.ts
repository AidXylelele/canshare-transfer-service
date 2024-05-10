import {
  Asset,
  RawAsset,
  RawAssetVariantMaster,
  GroupedAssetsOnCollectionId,
  FilteredAssetsByChangingEvent,
} from "../../types/external/asset.types";
import {
  AssetCollectionsMap,
  AssetGrouLengthLimi,
  AssetSizeLimitsMap,
  AssetsGroupSizeLimit,
  RawAssetLinkVariants,
} from "../../consts/asset.const";
import { Map } from "../../types/common.types";
import { ObjectHelpers } from "../../helpers/object.helpers";

export class FilterTool {
  private objectHeplers: ObjectHelpers;
  private groupSizeLimit: number;
  private linkVariants: (keyof RawAsset)[];
  private sizeLimitsMap: Map<number>;
  private collectionsMap: Map<string[]>;
  private groupLengthLimit: number;

  constructor() {
    this.objectHeplers = new ObjectHelpers();
    this.groupSizeLimit = AssetsGroupSizeLimit;
    this.sizeLimitsMap = AssetSizeLimitsMap;
    this.collectionsMap = AssetCollectionsMap;
    this.linkVariants = RawAssetLinkVariants;
    this.groupLengthLimit = AssetGrouLengthLimi;
  }

  getVariantMasterData(rawAsset: RawAsset): RawAssetVariantMaster | null {
    const pathToVariantData = "variants.master";

    for (const variant of this.linkVariants) {
      const fullPath = `${variant}.${pathToVariantData}`;
      const data = this.objectHeplers.getKey<RawAsset, RawAssetVariantMaster>(rawAsset, fullPath);

      if (data) return data;
    }

    return null;
  }

  getCollectionSizeLimit(asset: RawAsset): number | null {
    const collectionId = this.getCollectionId(asset);
    return this.sizeLimitsMap[collectionId] ?? null;
  }

  getDataType(asset: Asset | RawAsset): string | null {
    if ("dataType" in asset) return asset.dataType;

    const masterData = this.getVariantMasterData(asset);
    return masterData && masterData.type ? masterData.type : null;
  }

  getCollectionId(asset: Asset | RawAsset): string {
    const assetDataType = this.getDataType(asset);
    const entries = Object.entries(this.collectionsMap);

    for (const entry of entries) {
      const [collectionId, dataTypes] = entry;

      if (dataTypes.includes(assetDataType)) return collectionId;
    }

    return null;
  }

  filterAssetsByChangeEvents(assets: RawAsset[]): FilteredAssetsByChangingEvent {
    const deleting = [];
    const updating = [];

    for (const asset of assets) {
      if (asset.toUpdate) updating.push(asset);
      if (asset.wixDeletion) deleting.push(asset);
    }

    return { deleting, updating };
  }

  selectVariantBySize(rawAsset: RawAsset): RawAsset {
    const pathToSize = "variants.master.size";
    const excludedVariants: (keyof RawAsset)[] = [];

    let selectedVariant = null;
    let selectedSize = null;

    for (const variant of this.linkVariants) {
      const fullPath = `${variant}.${pathToSize}`;
      const size = this.objectHeplers.getKey<RawAsset, number>(rawAsset, fullPath);

      if (!size) continue;

      if (!selectedVariant) {
        selectedVariant = variant;
        selectedSize = size;
        continue;
      }

      if (selectedSize > size) {
        excludedVariants.push(selectedVariant);
        selectedSize = size;
        selectedVariant = variant;
      }
    }

    const processedRawAsset = this.objectHeplers.omitFields(rawAsset, excludedVariants);
    return processedRawAsset as RawAsset;
  }

  groupAssetsOnCollectionId<T extends Asset>(assets: T[]): GroupedAssetsOnCollectionId<T> {
    const result: GroupedAssetsOnCollectionId<T> = {};

    for (const asset of assets) {
      const collectionId = this.getCollectionId(asset);
      const group = result[collectionId];

      if (!group) {
        result[collectionId] = [asset];
        continue;
      }

      group.push(asset);
    }

    return result;
  }

  groupAssetsBySize<T extends RawAsset>(rawAssets: T[]): T[][] {
    const groups: T[][] = [];
    let currentGroup: T[] = [];
    let currentGroupSize = 0;

    for (const rawAsset of rawAssets) {
      const processed = this.selectVariantBySize(rawAsset);
      const masterData = this.getVariantMasterData(processed);
      const size = masterData && masterData.size ? masterData.size : 0;
      const isOverSized = currentGroupSize + size > this.groupSizeLimit;
      const isFilled = currentGroup.length >= this.groupLengthLimit;

      if (isOverSized || isFilled) {
        groups.push(currentGroup);
        currentGroup = [];
        currentGroupSize = 0;
      }

      currentGroup.push(processed as T);
      currentGroupSize += size;
    }

    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }

    return groups;
  }
}
