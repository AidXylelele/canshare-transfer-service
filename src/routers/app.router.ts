import { wixRouter } from "./wix.router";
import { userRouter } from "./user.router";
import { Application } from "express";
import { messageRouter } from "./message.router";
import { censhareRouter } from "./censhare.router";

export class AppRouters {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  init() {
    this.app.use("/wix", wixRouter);
    this.app.use("/user", userRouter);
    this.app.use("/message", messageRouter);
    this.app.use("/censhare", censhareRouter);
  }
}
