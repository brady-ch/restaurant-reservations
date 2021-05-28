const knex = require("../db/connection");
const reservationService = require("../reservations/reservations.service");

const create = async (table) => {
  return await knex("tables")
    .insert(table, "*")
    .then((response) => response[0]);
};

const list = async () => {
  return await knex("tables").orderBy("table_name", "asc");
};

const update = async (table_id, reservation_id) => {
  return await knex("tables")
    .where({ table_id })
    .update("reservation_id", reservation_id)
    .then(() => reservationService.updateStatus(reservation_id, "seated")); //TODO: change status to seated in reservation
};

const read = async (table_id) => {
  return await knex("tables").where({ table_id }).first();
};

const readReservationID = async (table_id) => {
  return await knex("tables")
    .select("reservation_id")
    .where({ table_id })
    .first()
    .then((data) => data.reservation_id);
};

const destroy = async (table_id) => {
  const reservation_id = await readReservationID(table_id);

  return await knex("tables")
    .where({ table_id })
    .update("reservation_id", null)
    .then(() => reservationService.updateStatus(reservation_id, "finished"));
};

module.exports = {
  create,
  list,
  update,
  read,
  destroy,
};
