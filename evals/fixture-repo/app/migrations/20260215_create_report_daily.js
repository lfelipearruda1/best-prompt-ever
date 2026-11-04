exports.up = (knex) =>
  knex.schema.createTable("report_daily", (t) => {
    t.date("day").primary();
    t.integer("orders").notNullable();
    t.decimal("revenue", 12, 2).notNullable();
  });

exports.down = (knex) => knex.schema.dropTable("report_daily");
