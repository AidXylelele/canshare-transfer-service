import express from "express";
import passport from "passport";
import bodyParser from "body-parser";
import coockieParser from "cookie-parser";
import { AppRouters } from "./routers/app.router";
import {
  closeDBConnection,
  connectDB,
} from "./providers/database/database.connection";
import { applyPassportStrategy } from "./middlewares/passport.middleware";

const app = express();
const appRouters = new AppRouters(app);

connectDB();

app.use(coockieParser());
app.use(passport.initialize());
applyPassportStrategy(passport);
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

appRouters.init();

const server = app.listen(process.env.APP_PORT);

process.on("SIGTERM", () => {
  server.close(async () => {
    await closeDBConnection();
    process.exit(0);
  });
});
