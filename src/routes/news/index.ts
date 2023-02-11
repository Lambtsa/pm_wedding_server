import express, { NextFunction, Request, Response } from "express";

import {
  AuthenticationError,
  BadRequestError,
  MethodNotAllowedError,
} from "@core/errors";
import { sanitiseData, validateData } from "@helpers/sanitise";
import { News, Translation } from "@modules";
import * as z from "zod";
import { TypeOf } from "zod";
import { randomEmoji } from "@helpers/emoji";
import { decodeToken } from "@helpers/jwt";
import WebSocket from "ws";
import { Languages } from "@types";
import { Knex } from "knex";

const router = express.Router();

const newsInputDataSchema = z.object({
  EN: z.object({
    title: z.string().min(1).max(20),
    description: z.string().min(1).max(140),
  }),
  FR: z.object({
    title: z.string().min(1).max(20),
    description: z.string().min(1).max(140),
  }),
  ES: z.object({
    title: z.string().min(1).max(20),
    description: z.string().min(1).max(140),
  }),
});

type NewsInputType = TypeOf<typeof newsInputDataSchema>;

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  req.context.log.info({ body: req.body });
  try {
    /* ######################################## */
    /* Request parsing */
    /* ######################################## */
    const {
      body: {
        EN: { title: enRawTitle, description: enRawDescription },
        ES: { title: esRawTitle, description: esRawDescription },
        FR: { title: frRawTitle, description: frRawDescription },
      },
      context,
      headers: { authorization },
    } = req;

    if (
      !enRawTitle ||
      !enRawDescription ||
      !esRawTitle ||
      !esRawDescription ||
      !frRawTitle ||
      !frRawDescription
    ) {
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
    const { EN, FR, ES } = validateData<NewsInputType>(
      {
        EN: {
          title: sanitiseData(enRawTitle),
          description: sanitiseData(enRawDescription),
        },
        FR: {
          title: sanitiseData(frRawTitle),
          description: sanitiseData(frRawDescription),
        },
        ES: {
          title: sanitiseData(esRawTitle),
          description: sanitiseData(esRawDescription),
        },
      },
      newsInputDataSchema,
    );

    const emoji = randomEmoji();

    await context.db.transaction(async (trx: Knex.Transaction) => {
      const news = await News.db.insert(
        context,
        {
          emoji,
        },
        trx,
      );

      await Promise.all([
        await Translation.db.insert(
          context,
          {
            title: EN.title,
            description: EN.description,
            news_id: news.id,
            language: Languages.En,
          },
          trx,
        ),
        await Translation.db.insert(
          context,
          {
            title: FR.title,
            description: FR.description,
            news_id: news.id,
            language: Languages.Fr,
          },
          trx,
        ),
        await Translation.db.insert(
          context,
          {
            title: ES.title,
            description: ES.description,
            news_id: news.id,
            language: Languages.Es,
          },
          trx,
        ),
      ]);
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
      EN: {
        ...EN,
        emoji,
      },
      ES: {
        ...ES,
        emoji,
      },
      FR: {
        ...FR,
        emoji,
      },
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
