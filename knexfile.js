require("dotenv").config({ path: ".env.local" });

const isProd = process.env.NODE_ENV === "production";

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
/* TODO: make this more secure */
module.exports = {
  client: "pg",
  connection: {
    host: isProd ? process.env.AWS_DB_HOST : "db",
    port: isProd ? process.env.AWS_DB_PORT : 5432,
    user: isProd ? process.env.AWS_DB_USER : "postgres",
    password: isProd ? process.env.AWS_DB_PASSWORD : "postgres",
    database: isProd ? process.env.AWS_DATABASE : "wedding",
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
