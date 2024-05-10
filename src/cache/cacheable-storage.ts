import { Redis, RedisOptions } from "ioredis";

export class CacheableStorage {
  public tool: Redis;

  constructor(db: string = "0") {
    const connection = this.getConnection(db);
    this.tool = new Redis(connection);
  }

  private getConnection(db: string): RedisOptions {
    const port = +process.env.REDIS_PORT;
    const host = process.env.REDIS_HOST;
    const password = process.env.REDIS_PASSWORD;
    return { port, host, password, db: +db };
  }

  stringify<T>(value: T): string {
    return JSON.stringify(value);
  }

  parse<T>(value: string): T {
    return JSON.parse(value);
  }
}
