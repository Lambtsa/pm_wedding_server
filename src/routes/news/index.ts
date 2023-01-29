import express, { NextFunction, Request, Response } from "express";

import {
  BadRequestError,
  CustomApiErrorMessages,
  DbConflictError,
  MethodNotAllowedError,
} from "@core/errors";
import { validateData } from "@helpers/sanitise";
import { News } from "@modules";
import { Knex } from "knex";
import * as z from "zod";
import { TypeOf } from "zod";
import { randomEmoji } from "@helpers/emoji";

const router = express.Router();

const newsInputDataSchema = z.object({
  title: z.string().min(1).max(20),
  description: z.string().min(1).max(140),
});

type NewsInputType = TypeOf<typeof newsInputDataSchema>;

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    /* ######################################## */
    /* DATA */
    /* ######################################## */
    const {
      body: { title: rawTitle, description: rawDescription },
      context: { db },
    } = req;

    if (!rawTitle && !rawDescription) {
      next(new BadRequestError());
    }

    /* Remove white space and validate data before inserting in table  */
    const { title, description } = validateData<Omit<NewsInputType, "emoji">>(
      {
        title: rawTitle,
        description: rawDescription,
      },
      newsInputDataSchema,
    );

    const emoji = randomEmoji();

    await db
      .transaction(async (trx: Knex.Transaction) => {
        await News.db.insert({
          db,
          input: {
            title,
            description,
            emoji,
          },
          trx,
        });
      })
      .catch((err: any) => {
        if ("constraint" in err) {
          throw new DbConflictError(
            CustomApiErrorMessages.NewsDescriptionConflict,
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

/* Method Middleware */
router.use("/", (req: Request, _res: Response, next: NextFunction) => {
  if (req.method !== "POST") {
    const error = new MethodNotAllowedError();
    return next(error);
  }
});

export default router;
