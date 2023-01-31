import express, { NextFunction, Request, Response } from "express";

import {
  AuthenticationError,
  BadRequestError,
  MethodNotAllowedError,
} from "@core/errors";
import { validateData } from "@helpers/sanitise";
import { News } from "@modules";
import * as z from "zod";
import { TypeOf } from "zod";
import { randomEmoji } from "@helpers/emoji";
import { decodeToken } from "@helpers/jwt";
import WebSocket from "ws";

const router = express.Router();

const newsInputDataSchema = z.object({
  title: z.string().min(1).max(20),
  description: z.string().min(1).max(140),
});

type NewsInputType = TypeOf<typeof newsInputDataSchema>;

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    /* ######################################## */
    /* Request parsing */
    /* ######################################## */
    const {
      body: { title: rawTitle, description: rawDescription },
      context,
      headers: { authorization },
    } = req;

    if (!rawTitle && !rawDescription) {
      next(new BadRequestError());
    }

    const match = authorization?.match(/Bearer (.+)/);

    if (!match) {
      throw new AuthenticationError();
    }

    const token = match[1];

    if (!token) {
      throw new AuthenticationError();
    }

    const id = decodeToken(token);

    if (id !== process.env.AUTH_USER) {
      throw new AuthenticationError();
    }

    /* ######################################## */
    /* DATA Validation */
    /* ######################################## */
    const { title, description } = validateData<Omit<NewsInputType, "emoji">>(
      {
        title: rawTitle,
        description: rawDescription,
      },
      newsInputDataSchema,
    );

    const emoji = randomEmoji();

    await News.db.insert({
      context,
      input: {
        title,
        description,
        emoji,
      },
    });

    const recentNews = await News.db.select({ context });

    context.socket.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({ event: "latestNews", payload: recentNews }),
        );
      }
    });

    return res.status(200).json({
      title,
      description,
      emoji,
    });
  } catch (err) {
    console.log({ err });
    return next(err);
  }
});

router.get("/", async (req: Request, res: Response, _next: NextFunction) => {
  const { context } = req;

  const recentNews = await News.db.select({ context });

  res.status(200).json(recentNews);
});

/* Method Middleware */
router.use("/", (req: Request, _res: Response, next: NextFunction) => {
  if (req.method !== "POST" && req.method !== "GET") {
    const error = new MethodNotAllowedError();
    return next(error);
  }
});

export default router;
