/** @type {import('knex').Knex.Migration['up']} */
const TABLE = "translations";

exports.up = async function (knex) {
  await knex.schema.raw(/* sql */ `
    CREATE TABLE "public"."${TABLE}" (
      "id" UUID default gen_random_uuid() NOT NULL PRIMARY KEY,
      "news_id" UUID NOT NULL,
      "language" text NOT NULL,
      "title" varchar(255) NOT NULL,
      "description" varchar(255) NOT NULL,
      UNIQUE ("title", "description", "language"),
      "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updated_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "languages_check" CHECK ((language = ANY (ARRAY['EN'::text, 'ES'::text, 'FR'::text]))),
      CONSTRAINT "fk_news_language" FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE
    );
  `);
};

/** @type {import('knex').Knex.Migration['down']} */
exports.down = async function (knex) {
  await knex.schema.raw(/* sql */ `
  `);
};
