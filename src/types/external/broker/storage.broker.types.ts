import { Connection } from "amqplib";

export type Collection<T> = {
  [key: string]: T | null;
};

export type User<T> = {
  connection: Connection | null;
  collection: Collection<T>;
};

export type Storage<T> = {
  [key: string]: User<T>;
};
