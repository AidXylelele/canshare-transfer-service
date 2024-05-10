import { CacheableStorage } from "../cache/cacheable-storage";

export class UserStorageTool extends CacheableStorage {
  constructor(db: string) {
    super(db);
  }

  async saveData<T>(user_id: string, value: T): Promise<void> {
    const stringified = this.stringify<T>(value);
    await this.tool.set(user_id, stringified);
  }

  async getData<T>(user_id: string): Promise<T> {
    const stringified = await this.tool.get(user_id);
    return this.parse<T>(stringified);
  }

  async deleteData(user_id: string): Promise<void> {
    await this.tool.del(user_id);
  }
}
