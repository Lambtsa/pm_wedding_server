import express, { NextFunction, Request, Response } from "express";

import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import * as http from "http";

import { config as appConfig } from "@config";
import api from "@routes/index";
import {
  CustomBaseError,
  CustomZodError,
  NotFoundError,
  TooManyRequestsError,
} from "@core/errors";
import { AddContext } from "@middleware/context";
import { createWebSocketServer } from "@core/websocket";

const app = express();

/* ######################################## */
/* Initialise a web server */
/* ######################################## */
const server = http.createServer(app);

/* ######################################## */
/* Initialise websockets */
/* ######################################## */
const wss = createWebSocketServer({ server });

const config =
  process.env.NODE_ENV === "production" ? appConfig.prod : appConfig.dev;

const apiRequestLimiter = rateLimit({
  windowMs: config.rateLimiter.interval,
  max: config.rateLimiter.max,
  handler: (_req: Request, _res: Response, next: NextFunction) => {
    const error = new TooManyRequestsError();
    return next(error);
  },
});

/* @see https://github.com/express-rate-limit/express-rate-limit */
app.use(apiRequestLimiter);
/* @see https://helmetjs.github.io/ */
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
/* @see https://github.com/expressjs/morgan */
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms"),
);
app.use(
  cors({
    origin: config.cors.origin,
  }),
);

/* ######################################## */
/* Add db connection to middleware - This means that for each request we make a connection  */
/* ######################################## */
app.use(AddContext(wss));
app.use(express.static("public"));

/* ######################################## */
/* Router */
/* ######################################## */
app.get("/ping", (_req: Request, res: Response, _next: NextFunction) => {
  return res.status(200).json({
    message: "pong",
  });
});
app.use("/api", api);

/* ######################################## */
/* Error Handling - DO NOT place any other endpoint or middleware after these two. */
/* ######################################## */
app.use((_req: Request, _res: Response, next: NextFunction) => {
  return next(new NotFoundError());
});

app.use(
  (err: CustomBaseError, _: Request, res: Response, _next: NextFunction) => {
    console.log({ err });
    const statusCode = err.statusCode || 500;

    if (err instanceof CustomZodError) {
      console.log("here");
      return res.status(statusCode).json(err.errors);
    }

    if (statusCode >= 400 && statusCode < 500) {
      return res.status(statusCode).json({
        message: err.message,
      });
    }
    return res.status(statusCode).send();
  },
);

export default server;
