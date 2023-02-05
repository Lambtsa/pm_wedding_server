import express from "express";
import news from "./news";
import email from "./email";

const router = express.Router();

router.use("/news", news);
router.use("/email", email);

export default router;
