exports.up = (knex) =>
  knex.schema.createTable("orders", (t) => {
    t.string("id").primary();
    t.string("customer").notNullable();
    t.decimal("total", 10, 2).notNullable();
    t.string("status").notNullable();
    t.timestamp("createdAt").notNullable();
  });

exports.down = (knex) => knex.schema.dropTable("orders");
