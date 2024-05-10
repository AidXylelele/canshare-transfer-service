import { Options } from "./broker.types";
import { Broker } from "../../../message-broker/message-broker";
import { Channel, Replies } from "amqplib";
import { ConsumerCallback } from "./consumer.broker.types";

export type Queue = {
  channel: Channel | null;
  consumer: Replies.Consume | null;
};

export type QueueCallback = (
  options: Options,
  broker: Broker
) => ConsumerCallback;
