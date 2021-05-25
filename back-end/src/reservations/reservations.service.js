const knex = require("../db/connection");

/**
 *
 * @param {*} date - date of requested reservation data
 * @returns reservations - all of the reservations on the given date
 */
const list = async (reservation_date) => {
  return await knex("reservations")
    .where({ reservation_date: reservation_date })
    .orderBy("reservation_time", "asc");
};

/**
 *
 * @param {object} {first_name, last_name, reservation_date, reservation_time, mobile_number, people}
 * @returns the created reservation
 */
const create = async (reservation) => {
  return await knex("reservations")
    .insert(reservation, "*")
    .then((response) => response[0]);
};

/**
 *
 * @param {number} reservation_id
 * @returns the reservation at that reservation_id
 */
const read = async (reservation_id) => {
  return await knex("reservations").where({ reservation_id }).first();
};

module.exports = {
  list,
  create,
  read,
};
