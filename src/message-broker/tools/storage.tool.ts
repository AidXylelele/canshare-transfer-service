import { Helpers } from "./helpers";
import { User, Storage } from "../../types/external/broker/storage.broker.types";

export class StorageTool<T> extends Helpers {
  public storage: Storage<T>;

  constructor() {
    super();
    this.storage = {};
  }

  async initUser(user_id: string): Promise<User<T>> {
    const connection = await this.createConnection(user_id, this.storage);
    const newUser = { connection, collection: {} } as User<T>;
    this.storage[user_id] = newUser;
    return this.storage[user_id];
  }

  async getUser(user_id: string): Promise<User<T>> {
    const user = this.storage[user_id];

    if (user && user.connection) return user;

    const newUser = await this.initUser(user_id);
    return newUser;
  }

  createCollectionKey(user_id: string, name: string) {
    return `${user_id}_${name}`;
  }
}
