require("dotenv").config({ path: ".env.local" });

const isProd = process.env.NODE_ENV === "production";

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
/* TODO: make this more secure */
module.exports = {
  client: "pg",
  connection: {
    host: isProd
      ? process.env.AWS_DB_HOST
      : process.env.AWS_DB_HOST_DEV || "localhost",
    port: isProd
      ? process.env.AWS_DB_PORT
      : process.env.AWS_DB_PORT_DEV || 5433,
    user: isProd
      ? process.env.AWS_DB_USER
      : process.env.AWS_DB_USER_DEV || "postgres",
    password: isProd
      ? process.env.AWS_DB_PASSWORD
      : process.env.AWS_DB_PASSWORD_DEV || "postgres",
    database: isProd
      ? process.env.AWS_DATABASE
      : process.env.AWS_DATABASE_DEV || "audiolinx",
    ssl: isProd ? { rejectUnauthorized: false } : false,
  },
  searchPath: [process.env.SCHEMA || "postgres", "public"],
  pool: {
    acquireTimeoutMillis: 300 * 1000,
    createTimeoutMillis: 300 * 1000,
  },
  migrations: {
    directory: "./db/migrations",
    tableName: "knex_migrations",
    schemaName: "public",
    stub: "db/knex.migration.stub.js",
  },
  seeds: {
    extension: "js",
    directory: "./dist/db/seeds",
    stub: "src/db/knex.seed.stub.ts",
  },
};
