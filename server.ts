require("dotenv").config();
import express from "express";
import passport from "passport";
import bodyParser from "body-parser";
import coockieParser from "cookie-parser";
import { AppRouters } from "./routers/app.router";
import { connectDB } from "./database/database.connection";
import { applyPassportStrategy } from "./middlewares/passport.middleware";

const app = express();
const appRouters = new AppRouters(app);

connectDB();

app.use(coockieParser());
app.use(passport.initialize());
applyPassportStrategy(passport);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

appRouters.init();

const server = app.listen(8080);

process.on("SIGTERM", () => {
  server.close(() => {
    process.exit(0);
  });
});
