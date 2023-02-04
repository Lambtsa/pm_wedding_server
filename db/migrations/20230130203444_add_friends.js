/** @type {import('knex').Knex.Migration['up']} */
const TABLE = "friends";

exports.up = async function (knex) {
  await knex.schema.raw(/* sql */ `
    CREATE TYPE activity AS ENUM ('horse','boules','climbing','volleyball','hiking','paragliding','yoga','spa');  
 
    CREATE TABLE "public"."${TABLE}" (
      "id" UUID NOT NULL PRIMARY KEY,
      "name" varchar(255) NOT NULL,
      "email" varchar(255) NOT NULL UNIQUE,
      "activities" activity ARRAY NOT NULL,
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
