exports.up = function (knex) {
  return knex.schema.createTable("reservations", (table) => {
    table.increments("reservation_id").primary();
    table.string("first_name").notNullable();
    table.string("last_name").notNullable();
    table.string("mobile_number", 15).notNullable();
    table.date("reservation_date", 15).notNullable();
    table.time("reservation_time", 15).notNullable();
    table.integer("people").notNullable();
    table.string("status", 15).defaultTo("booked");
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("reservations");
};
