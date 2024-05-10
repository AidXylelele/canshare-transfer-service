import { Wix } from "../models/wix.model";
import { UpdateWixData } from "../types/services/wix.service.types";
import { UserStorageTool } from "../tools/user-storage.tool";
import { WixCombinedModel, WixData } from "../types/models/wix.model.types";

export class WixService {
  private model: WixCombinedModel;
  private userStorage: UserStorageTool;

  constructor() {
    this.model = Wix;
    this.userStorage = new UserStorageTool(process.env.WIX_REDIS_DB);
  }

  async create(user_id: string, data: WixData): Promise<void> {
    const record = await this.getByUserId(user_id);

    if (record) return;

    const uri = { user_id, ...data };
    await this.model.create(uri);
    await this.userStorage.saveData<WixData>(user_id, data);
  }

  async getByUserId(user_id: string): Promise<WixData> {
    const cached = await this.userStorage.getData<WixData>(user_id);

    if (cached) return cached;

    const record = await this.model.findByUserId(user_id);

    if (!record) return null;

    const { apiKey, siteId } = record;
    const cacheable = { apiKey, siteId };
    await this.userStorage.saveData<WixData>(user_id, cacheable);
    return record;
  }

  async update(user_id: string, data: UpdateWixData): Promise<UpdateWixData> {
    const updates = await this.model.update(user_id, data);
    const { apiKey, siteId } = await this.getByUserId(user_id);
    const updated = { apiKey, siteId, ...data };
    await this.userStorage.saveData<WixData>(user_id, updated);
    return updates;
  }

  async delete(user_id: string): Promise<void> {
    await this.model.delete(user_id);
    await this.userStorage.deleteData(user_id);
  }
}
