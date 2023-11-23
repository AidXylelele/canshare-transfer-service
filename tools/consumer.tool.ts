import { Options } from "../types/queue.types";
import { MetaData } from "../types/metaData.types";
import { QueueTool } from "./queue.tool";
import { UriService } from "../services/uri.service";
import { CustomError } from "./error.tool";
import { FetchTool } from "./fetch.tool";
import { ConsumeMessage } from "amqplib";

export class ConsumerTool {
  private fetch: FetchTool;
  private uri: UriService;

  constructor() {
    this.fetch = new FetchTool();
    this.uri = new UriService();
  }

  private parse<T>(message: ConsumeMessage): T {
    const stringified = message.content.toString();
    return JSON.parse(stringified);
  }

  private async sendToRetryQueue(
    error: any,
    options: Options,
    queueTool: QueueTool
  ) {
    const message = { error: error.message };
    const retryOptions = { ...options, name: "retry" };
    await queueTool.sendMessage(message, retryOptions);
  }

  mainQueuesHandler =
    (options: Options, queueTool: QueueTool) =>
    async (msg: ConsumeMessage | null) => {
      try {
        if (!msg) {
          const errorName = "Consumer Error";
          const errorMessage = `Empty message in ${options.user_id}_${options.name} queue!`;
          throw new CustomError(errorName, errorMessage, 500);
        }

        const queue = await queueTool.getQueue(options);
        const content = this.parse<MetaData>(msg);
        const userUrls = await this.uri.getByUserId(options.user_id);
        const url = userUrls[options.name];
        await this.fetch.send(url, content);
        queue.channel.ack(msg);
      } catch (error: any) {
        console.log("Queue Consumer Error", error);
        await this.sendToRetryQueue(error, options, queueTool);
      }
    };

  retryQueuesHandler =
    (options: Options, queueTool: QueueTool) =>
    async (msg: ConsumeMessage | null) => {
      const queue = await queueTool.getQueue(options);
      const content = this.parse<MetaData>(msg);
      const { logs } = await this.uri.getByUserId(options.user_id);
      await this.fetch.send(logs, content);
      queue.channel.ack(msg);
    };
}
