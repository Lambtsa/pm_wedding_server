import express, { NextFunction, Request, Response } from "express";

import { BadRequestError, MethodNotAllowedError } from "@core/errors";
import { validateData } from "@helpers/sanitise";
import { Friend } from "@modules";
import * as z from "zod";
import { TypeOf } from "zod";

const router = express.Router();

const emailInputDataSchema = z.object({
  name: z.string().min(1).max(20),
  email: z.string().min(1).email(),
});

type EmailInputType = TypeOf<typeof emailInputDataSchema>;

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    /* ######################################## */
    /* Request parsing */
    /* ######################################## */
    const {
      body: { name: rawName, email: rawEmail, activities },
      context,
    } = req;

    if (!rawName && !rawEmail) {
      next(new BadRequestError());
    }

    /* ######################################## */
    /* DATA Validation */
    /* ######################################## */
    const { name, email } = validateData<Omit<EmailInputType, "activities">>(
      {
        name: rawName,
        email: rawEmail,
      },
      emailInputDataSchema,
    );

    await Friend.db.upsert({
      context,
      input: {
        name,
        email,
        activities,
      },
    });

    return res.status(200).send();
  } catch (err) {
    console.log({ err });
    return next(err);
  }
});

/* Method Middleware */
router.use("/", (req: Request, _res: Response, next: NextFunction) => {
  if (req.method !== "POST" && req.method !== "GET") {
    const error = new MethodNotAllowedError();
    return next(error);
  }
});

export default router;
