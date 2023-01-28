import dotenv from "dotenv";
import app from "./app";
dotenv.config({ path: "./.env.local" });

const port = process.env.PORT || 8080;

app.listen(port, () =>
  console.log(`App is listening on http://localhost:${port}`),
);
