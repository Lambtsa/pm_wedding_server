/** @type {import('knex').Knex.Migration['up']} */
exports.up = async function (knex) {
  await knex.schema.raw(/* sql */ `
  `);

  // Create table
  // await knex.schema.createTable(TABLE, (table) => {
  //   table.uuid("id").primary();
  //
  //   table.timestamp("createdAt").defaultTo(knex.fn.now()).notNullable();
  //   table.timestamp("updatedAt").defaultTo(knex.fn.now()).notNullable();
  // });

  // Add column
  // await knex.schema.table(TABLE, (table) => {
  //   table.string("columnName").notNullable();
  // })
};

/** @type {import('knex').Knex.Migration['down']} */
exports.down = async function (knex) {
  await knex.schema.raw(/* sql */ `
  `);

  // Drop table
  // await knex.schema.dropTable(TABLE);

  // Drop column
  // await knex.schema.table(TABLE, (table) => {
  //   table.dropColumn("columnName");
  // });
};
