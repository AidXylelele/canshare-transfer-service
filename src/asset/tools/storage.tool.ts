import { AssetRecord } from "../../types/external/asset.types";
import { CacheableStorage } from "../../cache/cacheable-storage";

export class StorageTool extends CacheableStorage {
  constructor() {
    super(process.env.ASSETS_REDIS_DB);
  }

  private formCacheKey(user_id: string, assetId: number): string {
    return `${user_id}:${assetId}`;
  }

  async saveAssets(user_id: string, assets: AssetRecord[]): Promise<void> {
    const promises = [];

    for (const asset of assets) {
      const cacheKey = this.formCacheKey(user_id, asset.assetId);
      const stringified = this.stringify(asset);
      const promise = this.tool.set(cacheKey, stringified);
      promises.push(promise);
    }

    await Promise.all(promises);
  }

  async deleteAssets(user_id: string, assets: AssetRecord[]): Promise<void> {
    const cacheKeys = assets.map((asset) => this.formCacheKey(user_id, asset.assetId));
    await this.tool.del(...cacheKeys);
  }

  async getAssetById(user_id: string, assetId: number): Promise<AssetRecord> {
    const cacheKey = this.formCacheKey(user_id, assetId);
    const value = await this.tool.get(cacheKey);
    return this.parse(value);
  }
}
