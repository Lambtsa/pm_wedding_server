import Knex from "knex";
import { config } from "@config";

const isProd = process.env.NODE_ENV === "production";

export const createConnection = () => {
  return Knex({
    client: "pg",
    connection: isProd ? config.prod.connection : config.dev.connection,
    searchPath: ["public", "public"],
    acquireConnectionTimeout: 15000,
    debug: !isProd,
    pool: {
      min: 0,
      max: 1000,
      acquireTimeoutMillis: 3000,
      idleTimeoutMillis: 5000,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  });
};
