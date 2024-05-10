import { AxiosError } from "axios";
import { ConsumeMessage } from "amqplib";

export type ConsumerUserData = {
  url: string;
  email: string;
  secret: string;
};

export type ConsumerCallback = (msg: ConsumeMessage | null) => void;

export type ConsumerError = Error | AxiosError;

export type ErrorHandler = (user_id: string) => (error: any) => Promise<void>;
