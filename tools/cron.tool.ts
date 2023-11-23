import cron from "node-cron";

export class CronTool {
  private tool: any;

  constructor() {
    this.tool = cron;
  }

  start(expression: string, fn: any) {
    this.tool.schedule(expression, fn);
  }
}
