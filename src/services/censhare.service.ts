import { Censhare } from "../models/censhare.model";
import { UserStorageTool } from "../tools/user-storage.tool";
import { UpdateCenshareData } from "../types/services/censhare.service.types";
import { CenshareData, CenshareCombinedModel } from "../types/models/censhare.model.types";

export class CenshareService {
  private model: CenshareCombinedModel;
  private userStorage: UserStorageTool;

  constructor() {
    this.model = Censhare;
    this.userStorage = new UserStorageTool(process.env.CENSHARE_REDIS_DB);
  }

  async create(user_id: string, data: CenshareData): Promise<void> {
    const record = await this.getByUserId(user_id);

    if (record) return;

    const credentials = { user_id, ...data };
    await this.model.create(credentials);
    await this.userStorage.saveData<CenshareData>(user_id, data);
  }

  async getByUserId(user_id: string): Promise<CenshareData> {
    const cached = await this.userStorage.getData<CenshareData>(user_id);

    if (cached) return cached;

    const record = await this.model.findByUserId(user_id);

    if (!record) return null;

    const { username, password } = record;
    const cacheable = { username, password };
    await this.userStorage.saveData<CenshareData>(user_id, cacheable);

    return record;
  }

  async update(user_id: string, data: UpdateCenshareData): Promise<UpdateCenshareData> {
    const updates = await this.model.update(user_id, data);
    const { username, password } = await this.getByUserId(user_id);
    const updated = { username, password, ...data };
    await this.userStorage.saveData<CenshareData>(user_id, updated);
    return updates;
  }

  async delete(user_id: string) {
    await this.model.delete(user_id);
    await this.userStorage.deleteData(user_id);
  }
}
