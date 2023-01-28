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

const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  // POSTGRES_HOST_AUTH_METHOD,
} = process.env;

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
      database: "wedding",
      port: 5432,
      // ssl: { rejectUnauthorized: false },
    },
  },
  prod: {
    cors: {
      origin: "https://lambtsa.com",
      methods: ["POST"],
    },
    rateLimiter: {
      interval: 1 * 60 * 1000,
      max: 100,
    },
    connection: {
      host: POSTGRES_HOST,
      port: POSTGRES_PORT,
      user: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      database: POSTGRES_DB,
      ssl: { rejectUnauthorized: false },
    },
  },
};
