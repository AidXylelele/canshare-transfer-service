import { Options } from "../../types/external/broker/broker.types";
import { Producer } from "../../types/external/broker/producer.broker.types";
import { StorageTool } from "./storage.tool";

export class ProducerTool extends StorageTool<Producer> {
  constructor() {
    super();
  }

  async create(options: Options): Promise<void> {
    const { user_id, name } = options;
    const { connection, collection } = await this.getUser(user_id);
    const producerName = this.createCollectionKey(user_id, name);
    const channel = await this.createChannel(name, connection, collection);
    collection[producerName] = { channel };
  }

  async get(options: Options): Promise<Producer> {
    const { user_id, name } = options;
    const producerName = this.createCollectionKey(user_id, name);
    const { collection } = await this.getUser(user_id);

    if (!collection[producerName]) await this.create(options);

    return collection[producerName];
  }

  async sendMessage<T>(message: T, options: Options): Promise<void> {
    const { channel } = await this.get(options);
    const queueName = this.createCollectionKey(options.user_id, options.name);
    const buffer = this.toBuffer(message);
    channel.sendToQueue(queueName, buffer);
  }
}
