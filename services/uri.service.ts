import { Uri } from "../models/uri.model";
import { UpdateUriData, UriCombinedModel, UriData } from "../types/uri.types";

export class UriService {
  private model: UriCombinedModel;

  constructor() {
    this.model = Uri;
  }

  async create(user_id: string, data: UriData) {
    const record = await this.getByUserId(user_id);

    if (record) return;

    const uri = { user_id, ...data };
    await this.model.create(uri);
  }

  async getByUserId(user_id: string) {
    const uri = await this.model.findByUserId(user_id);
    return uri;
  }

  async update(user_id: string, data: UpdateUriData) {
    const updated = await this.model.update(user_id, data);
    return updated;
  }
}
