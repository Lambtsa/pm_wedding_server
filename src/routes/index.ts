import express from "express";
import news from "./news";

const router = express.Router();

router.use("/news", news);

export default router;
