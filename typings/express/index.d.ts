import Knex from "knex";
import { Server, WebSocket } from "ws";
import { DestinationStream, Logger, LoggerOptions } from "pino";

/* @see https://stackoverflow.com/a/68641378/16334980 */
declare global {
  namespace Express {
    interface RequestContext {
      db: Knex<any, unknown[]>;
      socket: Server<WebSocket>;
      log: Logger<LoggerOptions | DestinationStream>;
    }
    interface Request {
      context: RequestContext;
    }
  }
}
