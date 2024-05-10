import { Checkpoint } from "../models/checkpoint.model";
import { CheckpointCombinedModel } from "../types/models/checkpoint.model.types";

export class CheckpointService {
  private model: CheckpointCombinedModel;

  constructor() {
    this.model = Checkpoint;
  }

  async setState(user_id: string) {
    const record = await this.model.find(user_id);

    if (!record) {
      await this.model.create({ user_id });
      return;
    }

    const state = true;

    await this.model.update(user_id, state);
  }

  async getState(user_id: string) {
    const record = await this.model.find(user_id);
    return record?.isFinished;
  }

  async delete(user_id: string) {
    await this.model.delete(user_id);
  }
}
