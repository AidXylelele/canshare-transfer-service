import { Helpers } from "./tools/helpers";
import { Options } from "../types/external/broker/broker.types";
import { QueueTool } from "./tools/queue.tool";
import { CustomError } from "../dto/error.dto";
import { ProducerTool } from "./tools/producer.tool";
import { QueueCallback } from "../types/external/broker/queue.broker.types";

export class Broker {
  helpers: Helpers;
  queues: QueueTool;
  producers: ProducerTool;

  constructor() {
    this.helpers = new Helpers();
    this.queues = new QueueTool();
    this.producers = new ProducerTool();
  }

  async setUserQueue(options: Options, fn: QueueCallback): Promise<void> {
    const queue = await this.queues.get(options);
    const cb = fn(options, this);
    await this.queues.setConsumer(options, queue, cb);
  }

  async process<T>(options: Options, messages: T[], fn: QueueCallback): Promise<void> {
    try {
      await this.setUserQueue(options, fn);
      for (const message of messages) {
        await this.producers.sendMessage(message, options);
      }
    } catch (error) {
      throw new CustomError("Queue Error", "Unexpected error!", 500);
    }
  }
}
