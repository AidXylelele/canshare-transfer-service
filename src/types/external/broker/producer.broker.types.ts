import { Channel } from "amqplib";

export type Producer = {
  channel: Channel | null;
};
