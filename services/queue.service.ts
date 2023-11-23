import { MetaData } from "../types/metaData.types";
import { QueueTool } from "../tools/queue.tool";
import { ConsumerTool } from "../tools/consumer.tool";

export class QueueService {
  private tool: QueueTool;
  private consumerTool: ConsumerTool;

  constructor() {
    this.tool = new QueueTool();
    this.consumerTool = new ConsumerTool();
  }

  private async processQueueOperation(
    user_id: string,
    metaData: MetaData[],
    operationName: string
  ) {
    const options = { user_id, name: operationName };

    const mainFn = this.consumerTool.mainQueuesHandler.bind(this.consumerTool);
    const retryFn = this.consumerTool.retryQueuesHandler.bind(
      this.consumerTool
    );

    await this.tool.process<MetaData>(options, metaData, mainFn, retryFn);
  }

  async upload(user_id: string, metaData: MetaData[]) {
    await this.processQueueOperation(user_id, metaData, "upload");
  }

  async update(user_id: string, metaData: MetaData[]) {
    await this.processQueueOperation(user_id, metaData, "update");
  }

  async delete(user_id: string, metaData: MetaData[]) {
    await this.processQueueOperation(user_id, metaData, "delete");
  }
}
