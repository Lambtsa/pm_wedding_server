import dotenv from "dotenv";
import server from "./app";
dotenv.config({ path: "./.env.local" });

const port = process.env.PORT || 8080;

server.listen(port, () =>
  console.log(`App is listening on http://localhost:${port}`),
);
