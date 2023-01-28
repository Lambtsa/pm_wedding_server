import { createConnection } from "@core/db";
import { NextFunction, Request, Response } from "express";
import { DbConnectionError } from "@core/errors";

/**
 * Adds context to each request allowing access to external classes and db connection
 */
export const AddContext =
  () => async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const db = await createConnection();

      /* ######################################## */
      /* Test connection */
      /* ######################################## */
      await db.raw("SELECT 1+1 as result");

      const context: Express.RequestContext = {
        db,
      };
      req.context = context;
      return next();
    } catch (err) {
      next(new DbConnectionError("Db connection error"));
    }
  };
