import { HttpMethods } from "@types";
import type { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

interface ConfigType {
  cors: {
    origin: string;
    methods: Extract<HttpMethods, "POST">[];
  };
  rateLimiter: {
    interval: number;
    max: number;
  };
  connection: Knex.Config["connection"];
}
interface Config {
  dev: ConfigType;
  prod: ConfigType;
}

export const config: Config = {
  dev: {
    cors: {
      origin: "https://localhost:3000",
      methods: ["POST"],
    },
    rateLimiter: {
      interval: 1 * 60 * 1000 * 60,
      max: 300,
    },
    connection: {
      host: "db",
      user: "postgres",
      password: "postgres",
      database: "audiolinx",
      port: 5432,
      // ssl: { rejectUnauthorized: false },
    },
  },
  prod: {
    cors: {
      origin: "https://audiolinx.xyz",
      methods: ["POST"],
    },
    rateLimiter: {
      interval: 1 * 60 * 1000,
      max: 100,
    },
    connection: {
      host: "AWS_DB_HOST",
      port: 5432,
      user: "AWS_DB_USER",
      password: "AWS_DB_PASSWORD",
      database: "AWS_DATABASE",
      ssl: { rejectUnauthorized: false },
    },
  },
};
