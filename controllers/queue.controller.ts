import { QueuePush } from "../types/queue.types";
import { QueueService } from "../services/queue.service";
import { AuthedExtendedRequest } from "../types/request.types";

export class QueueController {
  private service = new QueueService();

  async upload(req: AuthedExtendedRequest<QueuePush>) {
    const { identification, body } = req;
    const user_id = identification._id;
    const metaData = body.result;
    await this.service.upload(user_id, metaData);
    return;
  }

  async update(req: AuthedExtendedRequest<QueuePush>) {
    const { identification, body } = req;
    const user_id = identification._id;
    const metaData = body.result;
    await this.service.update(user_id, metaData);
    return;
  }

  async delete(req: AuthedExtendedRequest<QueuePush>) {
    const { identification, body } = req;
    const user_id = identification._id;
    const metaData = body.result;
    await this.service.delete(user_id, metaData);
    return;
  }
}
