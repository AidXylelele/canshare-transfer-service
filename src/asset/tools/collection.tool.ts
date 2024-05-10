import {
  Asset,
  WixFailure,
  AssetRecord,
  CheckedAssets,
  CollectionOperation,
  GroupedAssetsOnCollectionId,
} from "../../types/external/asset.types";
import {
  QueryCollectionOptions,
  RemoveCollectionOptions,
  InsertAndUpdateCollectionOptions,
} from "../../dto/collection.options.dto";
import { DataItem } from "@wix/data/build/cjs/src/data-v2-data-item.universal";
import { ClientTool } from "./client.tool";
import { FilterTool } from "./filter.tool";
import { StorageTool } from "./storage.tool";
import { ArrayHelpers } from "../../helpers/array.helpers";
import { OperationResult } from "../../dto/operationResult.dto";

export class CollectionTool extends ClientTool {
  private filterTool: FilterTool;
  private storageTool: StorageTool;
  private arrayHelpers: ArrayHelpers;

  constructor() {
    super();
    this.filterTool = new FilterTool();
    this.storageTool = new StorageTool();
    this.arrayHelpers = new ArrayHelpers();
  }

  private formDataItems(arrayOfData: Asset[] | AssetRecord[] | WixFailure[]) {
    const dataItems = [];

    for (const data of arrayOfData) {
      const dataItem: DataItem = { data };

      if ("_id" in data) dataItem._id = data._id as string;

      dataItems.push(dataItem);
    }

    return dataItems;
  }

  private formDataItemsIds(records: AssetRecord[]) {
    return records.map((record) => record._id);
  }

  private async getAssetFromCacheById(user_id: string, asset: Asset) {
    const cachedRecord = await this.storageTool.getAssetById(user_id, asset.assetId);
    return cachedRecord;
  }

  private async getAssetFromCollectionById(user_id: string, asset: Asset) {
    const fieldId = "assetId";
    const client = await this.getClient(user_id);
    const collectionId = this.filterTool.getCollectionId(asset);

    if (!collectionId) return {};

    const options = new QueryCollectionOptions(collectionId);
    const result = await client.items.queryDataItems(options).eq(fieldId, asset.assetId).find();

    if (!result.items.length) return {};

    return result.items[0].data;
  }

  private async getAssetById(user_id: string, asset: Asset): Promise<AssetRecord> {
    const cachedRecord = await this.getAssetFromCacheById(user_id, asset);

    if (cachedRecord) return cachedRecord;

    const collectionRecord = await this.getAssetFromCollectionById(user_id, asset);
    return collectionRecord;
  }

  private processError<T, R>(
    result: OperationResult<T, R>,
    grouped: GroupedAssetsOnCollectionId<R> = null,
  ) {
    const message = "Unexpected Error";
    const groupsAssets = Object.values(grouped);

    if (!grouped) {
      result.fail({} as R, message);
      return result;
    }

    for (const assets of groupsAssets) {
      for (const asset of assets) {
        result.fail(asset, message);
      }
    }

    return result;
  }

  private async handler<T extends Asset>(
    method: string,
    collectionOperations: CollectionOperation[],
    grouped: GroupedAssetsOnCollectionId<T> = null,
  ) {
    const action = `Collection ${method} operation`;
    const operationResult = new OperationResult<AssetRecord, T>(action);

    try {
      const responses = await Promise.all(collectionOperations);

      if (!grouped) return operationResult;

      const groupKeys = Object.keys(grouped);
      const bulkDataItemResults = responses.map((item) =>
        item && item.results ? item.results : [],
      );

      for (const bulkDataItemResult of bulkDataItemResults) {
        const indexOfOperation = bulkDataItemResults.indexOf(bulkDataItemResult);
        const groupName = groupKeys[indexOfOperation];
        const assets = grouped[groupName];

        for (const element of bulkDataItemResult) {
          const { dataItem, itemMetadata } = element;
          const { error, originalIndex } = itemMetadata;
          const asset = assets[originalIndex];

          if (!dataItem && error) {
            operationResult.fail(asset, error.description);
          }

          const data = dataItem && dataItem.data ? dataItem.data : asset;
          operationResult.success(data as AssetRecord);
        }
      }

      return operationResult;
    } catch (error) {
      return this.processError(operationResult, grouped);
    }
  }

  async checkAssetsInCollection(user_id: string, assets: Asset[]): Promise<CheckedAssets> {
    const promises = [];

    for (const asset of assets) {
      const promise = this.getAssetById(user_id, asset);
      promises.push(promise);
    }

    const condition = "assetId";
    const records = await Promise.all(promises);
    const existing = this.arrayHelpers.getIntersectionWithMerge(records, assets, condition);
    const nonExsiting = this.arrayHelpers.getDifference(assets, records, condition);
    return { existing, nonExsiting };
  }

  async upload(user_id: string, assets: Asset[]) {
    const client = await this.getClient(user_id);
    const collectionOperations: CollectionOperation[] = [];
    const groups = this.filterTool.groupAssetsOnCollectionId(assets);

    for (const key in groups) {
      const assets = groups[key];
      const dataItems = this.formDataItems(assets);
      const options = new InsertAndUpdateCollectionOptions(key, dataItems);
      const collectionOperation = client.items.bulkInsertDataItems(options);
      collectionOperations.push(collectionOperation);
    }

    const response = await this.handler("upload", collectionOperations, groups);
    await this.storageTool.saveAssets(user_id, response.result);
    return response;
  }

  async update(user_id: string, assets: AssetRecord[]) {
    const client = await this.getClient(user_id);
    const collectionOperations: CollectionOperation[] = [];
    const groups = this.filterTool.groupAssetsOnCollectionId(assets);

    for (const key in groups) {
      const assets = groups[key];
      const dataItems = this.formDataItems(assets);
      const options = new InsertAndUpdateCollectionOptions(key, dataItems);
      const collectionOperation = client.items.bulkUpdateDataItems(options);
      collectionOperations.push(collectionOperation);
    }

    const response = await this.handler("update", collectionOperations, groups);
    await this.storageTool.saveAssets(user_id, response.result);
    return response;
  }

  async delete(user_id: string, assets: AssetRecord[]) {
    const client = await this.getClient(user_id);
    const collectionOperations: CollectionOperation[] = [];
    const groups = this.filterTool.groupAssetsOnCollectionId(assets);

    for (const key in groups) {
      const records = groups[key];
      const ids = this.formDataItemsIds(records);
      const options = new RemoveCollectionOptions(key, ids);
      const collectionOperation = client.items.bulkRemoveDataItems(options);
      collectionOperations.push(collectionOperation);
    }

    const response = await this.handler("delete", collectionOperations, groups);
    await this.storageTool.deleteAssets(user_id, response.result);
    return response;
  }

  async error(user_id: string, failures: WixFailure[]) {
    const client = await this.getClient(user_id);
    const dataItems = this.formDataItems(failures);
    const options = new InsertAndUpdateCollectionOptions("Error", dataItems);
    const operation = client.items.bulkInsertDataItems(options);
    const response = await this.handler("error", [operation]);
    return response;
  }
}
