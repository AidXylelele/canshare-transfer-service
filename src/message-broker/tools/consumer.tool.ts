import { Broker } from "../message-broker";
import { Options } from "../../types/external/broker/broker.types";
import { CustomError } from "../../dto/error.dto";
import { AssetManager } from "../../asset/asset.manager";
import { ConsumeMessage } from "amqplib";
import { Failure, RawAsset, WixFailure } from "../../types/external/asset.types";

export class ConsumerTool {
  private assetManager: AssetManager;

  constructor() {
    this.assetManager = new AssetManager();
  }

  private async handleError(
    options: Options,
    broker: Broker,
    message: ConsumeMessage,
    error: unknown,
  ) {
    const queue = await broker.queues.get(options);
    const newMessage = [error];
    const errorOptions = { ...options, name: "error" };
    await broker.producers.sendMessage(newMessage, errorOptions);
    queue.channel.reject(message, false);
  }

  process = (options: Options, broker: Broker) => async (msg: ConsumeMessage | null) => {
    try {
      if (!msg) throw new CustomError("Consumer", "Empty message", 500);

      const queue = await broker.queues.get(options);
      const data = broker.queues.parse<RawAsset[] & WixFailure[]>(msg);
      const method = options.name as keyof AssetManager;
      const failed = await this.assetManager[method](options.user_id, data);

      if (failed.length) await this.processFailures(options, broker, failed);

      queue.channel.ack(msg);
    } catch (error) {
      await this.handleError(options, broker, msg, error);
    }
  };

  private async processFailures(options: Options, broker: Broker, failures: Failure[]) {
    const errorOptions = { ...options, name: "error" };
    await broker.producers.sendMessage(failures, errorOptions);
  }
}
