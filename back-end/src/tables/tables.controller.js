const service = require("./tables.service");
const reservationService = require("../reservations/reservations.service");
const Table = require("./Table");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 * Middleware
 */

const hasData = async (req, res, next) => {
  const data = req.body.data;
  if (!data) {
    return next({ status: 400, message: "Missing data" });
  }
  if (!"reservation_id" in data || !data.reservation_id) {
    return next({ status: 400, message: "Missing reservation_id" });
  }
  res.locals.reservation_id = data.reservation_id;
  next();
};

const validatePartySize = async (req, res, next) => {
  const table_id = req.params.table_id;
  const table = await service.read(table_id);
  const reservation_id = res.locals.reservation_id;
  const reservation = await reservationService.read(reservation_id);
  if (!reservation) {
    return next({
      status: 404,
      message: `reservation with id ${reservation_id} does not exist`,
    });
  }
  if (+reservation.people > +table.capacity) {
    return next({ status: 400, message: "insufficient capacity" });
  }
  res.locals.reservation = reservation;
  res.locals.table = table;
  return next();
};

const tableIsntOccupied = async (req, res, next) => {
  const table = res.locals.table;
  if (table.reservation_id) {
    return next({ status: 400, message: "Table is already occupied" });
  }
  return next();
};

const validateData = async (req, res, next) => {
  const data = req.body.data;
  if (!data) return next({ status: 400, message: "missing data" });
  const table_name = "table_name" in data ? data.table_name : "";
  const capacity = "capacity" in data ? data.capacity : 0;
  const table = new Table(table_name, capacity);
  res.locals.table = data;
  return table.validateData
    ? next()
    : next({
        status: 400,
        message:
          "please enter a table_name or a value greater than 0 for capacity",
      });
};

const checkOccupied = async (req, res, next) => {
  const table_id = req.params.table_id;
  const table = await service.read(table_id);
  res.locals.table_id = table_id;
  if (!table) {
    next({
      status: 404,
      message: `There is not table with table_id: ${table_id}`,
    });
  }
  if (!table.reservation_id) {
    next({ status: 400, message: "That table is not occupied" });
  }
  next();
};

const checkReservationStatus = async (req, res, next) => {
  const reservation_id = res.locals.reservation_id;
  const reservation = await reservationService.read(reservation_id);
  if (reservation.status === "seated") {
    next({ status: 400, message: "that reservation is already seated" });
  }
  next();
};

/**
 * CRUD
 */
const create = async (req, res, next) => {
  const table = res.locals.table;
  return res.status(201).json({ data: await service.create(table) });
};

const list = async (req, res, next) => {
  return res.json({ data: await service.list() });
};

const update = async (req, res, next) => {
  const table_id = req.params.table_id;
  const { reservation_id } = req.body.data;
  return res.json({ data: await service.update(table_id, reservation_id) });
};

const destroy = async (req, res, next) => {
  const table_id = res.locals.table_id;
  await service.destroy(table_id);
  return res.sendStatus(200);
};

module.exports = {
  create: [asyncErrorBoundary(validateData), asyncErrorBoundary(create)],
  list: [asyncErrorBoundary(list)],
  update: [
    asyncErrorBoundary(hasData),
    asyncErrorBoundary(validatePartySize),
    asyncErrorBoundary(tableIsntOccupied),
    asyncErrorBoundary(checkReservationStatus),
    asyncErrorBoundary(update),
  ],
  destroy: [asyncErrorBoundary(checkOccupied), asyncErrorBoundary(destroy)],
};
