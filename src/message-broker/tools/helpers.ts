import amqplib, { Channel, Connection, ConsumeMessage } from "amqplib";

export class Helpers {
  private tool = amqplib;
  private uri: string;

  constructor() {
    this.uri = process.env.RABBIT_MQ_URI;
  }

  async createConnection<T>(user_id: string, storage: T): Promise<Connection> {
    const connection = await this.tool.connect(this.uri);
    const handler = this.connectionErrorHandler(user_id, storage);
    connection.on("error", handler);
    connection.on("close", handler);
    return connection;
  }

  async createChannel<T>(
    name: string,
    connection: Connection,
    collection: T
  ): Promise<Channel> {
    const channel = await connection.createChannel();
    const handler = this.channelErrorHandler(name, collection);
    channel.on("close", handler);
    return channel;
  }

  toBuffer(data: any): Buffer {
    const stringified = JSON.stringify(data);
    return Buffer.from(stringified);
  }

  parse<T>(message: ConsumeMessage): T {
    const stringified = message.content.toString();
    return JSON.parse(stringified);
  }

  connectionErrorHandler = (user_id: string, storage: any) => () => {
    storage[user_id] = null;
  };

  channelErrorHandler = (name: string, collection: any) => () => {
    collection[name] = null;
  };
}
