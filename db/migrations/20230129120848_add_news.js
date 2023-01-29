/** @type {import('knex').Knex.Migration['up']} */
const TABLE = "news";

exports.up = async function (knex) {
  await knex.schema.raw(/* sql */ `
    CREATE TABLE "public"."${TABLE}" (
      "id" UUID NOT NULL PRIMARY KEY,
      "title" varchar(255) NOT NULL,
      "emoji" varchar(1) NOT NULL,
      "description" varchar(255) NOT NULL,
      UNIQUE ("title", "description"),
      "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updated_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

/** @type {import('knex').Knex.Migration['down']} */
exports.down = async function (knex) {
  // Drop table
  await knex.schema.dropTable(TABLE);
};
