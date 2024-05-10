import { Broker } from "../message-broker/message-broker";
import { ConsumerTool } from "../message-broker/tools/consumer.tool";

export class QueueService {
  private broker: Broker;
  private consumerTool: ConsumerTool;

  constructor() {
    this.broker = new Broker();
    this.consumerTool = new ConsumerTool();
  }

  private async handle<T>(name: string, user_id: string, messages: T[]) {
    if (!messages.length) return;

    const mainQueueOptions = { user_id, name };
    const errorQueueOptions = { user_id, name: "error" };
    const handler = this.consumerTool.process;
    await this.broker.setUserQueue(errorQueueOptions, handler);
    await this.broker.process(mainQueueOptions, messages, handler);
  }

  async upload<T>(user_id: string, messages: T[]) {
    await this.handle("upload", user_id, messages);
  }

  async update<T>(user_id: string, messages: T[]) {
    await this.handle("update", user_id, messages);
  }

  async delete<T>(user_id: string, messages: T[]) {
    await this.handle("delete", user_id, messages);
  }
}
