import {
  RawAsset,
  CenshareEntityPage,
  CenshareEntitiesList,
} from "../../types/external/asset.types";
import { FetchTool } from "../../tools/fetch.tool";
import { CenshareData } from "../../types/models/censhare.model.types";
import { ArrayHelpers } from "../../helpers/array.helpers";

export class DownloadTool extends FetchTool {
  private pageLimit = 100;
  private arrayHelpers: ArrayHelpers;

  constructor() {
    super(process.env.CENSHARE_API_URL);
    this.arrayHelpers = new ArrayHelpers();
  }

  private async getCenshareAssetById(
    auth: CenshareData,
    entity: string,
    assetId: number,
  ): Promise<RawAsset> {
    const route = this.formRoute(entity, assetId);
    const request = this.tool.get(route, { auth });
    const asset = await this.handler<RawAsset>(request);
    return asset;
  }

  private async getCenshareEntityAssets(
    auth: CenshareData,
    entity: string,
    offset: number = 0,
  ): Promise<RawAsset[]> {
    const route = this.formRoute(entity);
    const request = this.tool.get(route, { auth, params: { offset } });
    const page = await this.handler<CenshareEntityPage>(request);
    const { count, result } = page;

    if (offset + count < page["total-count"]) {
      const nextOffset = offset + this.pageLimit;
      const nextData = await this.getCenshareEntityAssets(auth, entity, nextOffset);
      return [...result, ...nextData];
    }

    return result;
  }

  private async getCenshareEntities(auth: CenshareData): Promise<string[]> {
    const route = this.formRoute("");
    const request = this.tool.get(route, { auth });
    const entities = await this.handler<CenshareEntitiesList>(request);
    return Object.keys(entities).filter((key) => !key.includes("update"));
  }

  async getChangedCenshareAssets(
    auth: CenshareData,
    entity: string,
    assetIds: number[],
  ): Promise<RawAsset[]> {
    const promises = assetIds.map((assetId) => this.getCenshareAssetById(auth, entity, assetId));
    const assets = await Promise.all(promises);
    return assets;
  }

  async getAllCenshareAssets(auth: CenshareData): Promise<RawAsset[]> {
    const entities = await this.getCenshareEntities(auth);
    const promises = entities.map((entity) => this.getCenshareEntityAssets(auth, entity));
    const result = await Promise.all(promises);
    return this.arrayHelpers.flatten<RawAsset>(result);
  }
}
