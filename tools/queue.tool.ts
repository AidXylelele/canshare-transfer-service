import {
  Connections,
  Callback,
  Options,
  ProducersCollection,
  QueuesCollection,
  Queue,
} from "../types/queue.types";
import amqplib, { Connection } from "amqplib";
import { CronTool } from "./cron.tool";
import { CustomError } from "./error.tool";

export class QueueTool {
  private tool: any;
  private uri: string;
  private cron: CronTool;
  private connections: Connections;
  private queues: QueuesCollection;
  private producers: ProducersCollection;

  readonly cronExpression = "* * * * *";

  readonly configuration = {
    durable: true,
    autoDelete: true,
  };

  constructor() {
    this.tool = amqplib;
    this.cron = new CronTool();

    this.connections = {
      produce: null,
      consume: null,
    };

    this.queues = {};
    this.producers = {};

    this.uri = process.env.RABBIT_MQ_URI;

    this.cron.start(this.cronExpression, this.checkQueueStatus.bind(this));
  }

  private async connect() {
    for (const key in this.connections) {
      if (this.connections[key]) continue;
      this.connections[key] = await this.createConnection();
    }

    return this.connections;
  }

  private async createConnection() {
    const connection = await this.tool.connect(this.uri);
    return connection;
  }

  private async createChannel(connection: Connection) {
    const channel = await connection.createChannel();
    return channel;
  }

  private async createQueue(options: Options) {
    const { consume } = await this.connect();
    const { user_id, name } = options;

    const queueName = this.getName(user_id, name);

    const channel = await this.createChannel(consume);
    await channel.assertQueue(queueName, this.configuration);

    const userQueues = this.getUserQueues(user_id);
    userQueues[queueName] = { channel, consumer: null };
  }

  private async createProducer(options: Options) {
    const { produce } = await this.connect();
    const { user_id, name } = options;

    const producerName = this.getName(user_id, name);

    const channel = await this.createChannel(produce);

    const userProducers = this.getUserProducers(user_id);
    userProducers[producerName] = { channel };
  }

  private getName(user_id: string, name: string) {
    return `${user_id}_${name}`;
  }

  private toBuffer(data: any): Buffer {
    const stringified = JSON.stringify(data);
    return Buffer.from(stringified);
  }

  private getUserQueues(user_id: string) {
    this.queues[user_id] = this.queues[user_id] ?? {};
    return this.queues[user_id];
  }

  private getUserProducers(user_id: string) {
    this.producers[user_id] = this.producers[user_id] ?? {};
    return this.producers[user_id];
  }

  private async getProducer(options: Options) {
    const { user_id, name } = options;
    const producerName = this.getName(user_id, name);

    const userProducers = this.getUserProducers(user_id);

    if (!userProducers[producerName]) await this.createProducer(options);

    return userProducers[producerName];
  }

  async getQueue(options: Options) {
    const { user_id, name } = options;
    const queueName = this.getName(user_id, name);

    const userQueues = this.getUserQueues(user_id);

    if (!userQueues[queueName]) await this.createQueue(options);

    return userQueues[queueName];
  }

  async sendMessage<T>(message: T, options: Options) {
    const { channel } = await this.getProducer(options);

    const queueName = this.getName(options.user_id, options.name);
    const buffer = this.toBuffer(message);
    channel.sendToQueue(queueName, buffer);
  }

  private async setConsumer(options: Options, fn: Callback) {
    const queue = await this.getQueue(options);

    if (queue.consumer) return;

    const cb = fn(options, this);
    const queueName = this.getName(options.user_id, options.name);
    const consumer = await queue.channel.consume(queueName, cb);
    queue.consumer = consumer;
  }

  private async setUserRetryQueue(user_id: string, fn: Callback) {
    const name = "retry";
    const options = { user_id, name };
    await this.setConsumer(options, fn);
  }

  private async checkQueueStatus() {
    for (const user in this.queues) {
      const userQueues = this.queues[user];

      for (const name in userQueues) {
        const queue = userQueues[name];

        const isOpen = await this.isQueueOpen(queue, name);

        if (!isOpen) {
          userQueues[name] = null;
        }
      }
    }
  }

  private async isQueueOpen(queue: Queue, name: string) {
    try {
      const { channel, consumer } = queue;
      const { messageCount } = await channel.checkQueue(name);

      if (messageCount > 0) return true;

      await channel.cancel(consumer.consumerTag);
      await channel.close();
      return false;
    } catch (error) {
      return false;
    }
  }

  async process<T>(
    options: Options,
    messages: T[],
    mainFn: Callback,
    retryFn: Callback
  ) {
    try {
      await this.setUserRetryQueue(options.user_id, retryFn);
      await this.setConsumer(options, mainFn);

      for (const message of messages) {
        await this.sendMessage(message, options);
      }
    } catch (error) {
      throw new CustomError(
        "Queue Erorr",
        "Something went wrong with queus!",
        500
      );
    }
  }
}
