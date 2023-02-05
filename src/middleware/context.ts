import { createConnection } from "@core/db";
import { NextFunction, Request, Response } from "express";
import { DbConnectionError } from "@core/errors";
import logger from "pino";
import { Server, WebSocket } from "ws";

/**
 * Adds context to each request allowing access to external classes and db connection
 */
export const AddContext =
  (webSocket: Server<WebSocket>) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const db = await createConnection();

      /* ######################################## */
      /* Test connection */
      /* ######################################## */
      await db.raw("SELECT 1+1 as result");

      const log = logger();

      const context: Express.RequestContext = {
        db,
        log,
        socket: webSocket,
      };
      req.context = context;
      return next();
    } catch (err) {
      next(new DbConnectionError("Db connection error"));
    }
  };
