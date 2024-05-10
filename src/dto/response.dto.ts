import { CustomError } from "./error.dto";

export class ResponseConstructor<T> {
  public success: boolean;
  public message: string;
  public data: T | null;

  constructor(success: boolean, message: string, data: T | null = null) {
    this.success = success;
    this.message = message;
    this.data = data;
  }

  static success<T>(data: T): ResponseConstructor<T> {
    return new ResponseConstructor<T>(true, "Success", data);
  }

  static error<T>(error: Error | CustomError): ResponseConstructor<T> {
    const { name, message } = error;
    const text = `${name || "Unknown"}:${message}`;
    return new ResponseConstructor<T>(false, text);
  }
}
