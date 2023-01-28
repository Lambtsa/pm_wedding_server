import Knex from "knex";

/* @see https://stackoverflow.com/a/68641378/16334980 */
declare global {
  namespace Express {
    interface RequestContext {
      db: Knex<any, unknown[]>;
    }
    interface Request {
      context: RequestContext;
    }
  }
}
