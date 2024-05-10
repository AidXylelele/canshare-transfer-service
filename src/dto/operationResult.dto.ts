import { Failure } from "../types/external/asset.types";

export class OperationResult<T, R = T> {
  private action: string;
  public result: T[];
  public failed: Failure<R>[];

  constructor(action: string) {
    this.result = [];
    this.failed = [];
    this.action = action;
  }

  success(data: T) {
    this.result.push(data);
  }

  fail(asset: R, message: string) {
    const failure = { action: this.action, message, asset };
    this.failed.push(failure);
  }
}
