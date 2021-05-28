const Reservation = require("./Reservation.class");
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/*
 * Middlware functions are below
 */

/**
 * Midleware function to validate data for CRUD
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const validateData = async (req, res, next) => {
  const data = req.body.data || {};
  const first_name = "first_name" in data ? data.first_name : null;
  const last_name = "last_name" in data ? data.last_name : null;
  const mobile_number = "mobile_number" in data ? data.mobile_number : null;
  const reservation_date =
    "reservation_date" in data ? data.reservation_date : null;
  const reservation_time =
    "reservation_time" in data ? data.reservation_time : null;
  const people = "people" in data ? data.people : null;
  const status = "status" in data ? data.status : "booked";

  const reservation = new Reservation(
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
    status
  );
  if (reservation.validateArgs()) {
    return next({
      status: 400,
      message: `Please enter valid data for${reservation.validateArgs()}`,
    });
  }
  res.locals.reservation = reservation;
  return next();
};

const isAfterNow = async (req, res, next) => {
  const reservation = res.locals.reservation;
  const reservationUTC = new Date(
    `${reservation.reservation_date}T${reservation.reservation_time}:00`
  );
  if (Date.now() > reservationUTC.getTime()) {
    return next({
      status: 400,
      message: "Please enter a future date and time",
    });
  }
  res.locals.reservationUTC = reservationUTC;
  return next();
};

const isNotClosed = async (req, res, next) => {
  const reservationUTC = res.locals.reservationUTC;
  const timeInMinutes =
    reservationUTC.getHours() * 60 + reservationUTC.getMinutes();
  if (reservationUTC.getDay() === 2) {
    return next({ status: 400, message: "We are closed on Tuesdays" });
  } else if (1290 < timeInMinutes || timeInMinutes < 630) {
    return next({
      status: 400,
      message: `Please pick a time between 10:30 am and 9:30 pm`,
    });
  } else {
    return next();
  }
};

const reservationExists = async (req, res, next) => {
  const { reservation_id } = req.params;
  const reservation = await service.read(reservation_id);

  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  } else {
    return next({
      status: 404,
      message: `The reservation with id:${reservation_id} does not exist`,
    });
  }
};

const validateStatus = async (req, res, next) => {
  const reservation_id = req.params.reservation_id;
  const reservation = req.body.data;
  const currentRes = await service.read(reservation_id);
  if (currentRes.status === "finished") {
    return next({
      status: 400,
      message: "a finished reservation cannot be updated",
    });
  }
  if (
    !(
      reservation.status === "booked" ||
      reservation.status === "seated" ||
      reservation.status === "finished"
    )
  ) {
    return next({
      status: 400,
      message: `status ${reservation.status} is invalid`,
    });
  }
  res.locals.reservation_id = reservation_id;
  res.locals.reservation = reservation;
  next();
};

/*
 *  CRUD is below
 */

/**
 * grabs the date fromt he URL and returns the reservations for that date
 *
 * @param {*} req
 * @param {*} res
 */
const list = async (req, res) => {
  res.json({ data: await service.list(req.query.date) });
};

/**
 * Creates a new reservation
 *
 * @param {*} req
 * @param {*} res
 */
const create = async (req, res) => {
  res.status(201).json({ data: await service.create(res.locals.reservation) });
};

/**
 * Gets the data for one reservation specified by the reservation_id in the URL
 * @param {*} req
 * @param {*} res
 */
const read = async (req, res) => {
  const reservation_id = req.params.reservation_id;
  res.json({ data: await service.read(reservation_id) });
};

const update = async (req, res, next) => {
  const reservation = res.locals.reservation;
  const reservation_id = res.locals.reservation_id;
  res.json({
    data: await service.updateStatus(reservation_id, reservation.status),
  });
};

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    asyncErrorBoundary(validateData),
    asyncErrorBoundary(isAfterNow),
    asyncErrorBoundary(isNotClosed),
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  update: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(validateStatus),
    asyncErrorBoundary(update),
  ],
};
