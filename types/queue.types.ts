import { QueueTool } from "../tools/queue.tool";
import { MetaData } from "./metaData.types";
import { Channel, Connection, ConsumeMessage, Replies } from "amqplib";

export type Connections = {
  [key: string]: Connection | null;
};

export type QueuesCollection = {
  [key: string]: UserQueues;
};

export type UserQueues = {
  [key: string]: Queue;
};

export type Queue = {
  channel: Channel | null;
  consumer: Replies.Consume | null;
};

export type Producer = {
  channel: Channel;
};

export type UserProducers = {
  [key: string]: Producer;
};

export type ProducersCollection = {
  [key: string]: UserProducers;
};

export type Options = {
  user_id: string;
  name: string;
};

export type Callback = {
  (
    options: Options,
    queueTool: QueueTool
  ): (msg: ConsumeMessage | null) => void;
};

export type QueuePush = {
  results: MetaData[];
};
