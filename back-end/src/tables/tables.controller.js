const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function tableExists(req, res, next) {
  const { table_id } = req.params;
  const table = await service.read(Number(table_id));
  if (table) {
    res.locals.table = table;
    next();
  } else {
    next({ status: 404, message: `Table id does not exist: ${table_id}` });
  }
}

function tableIsAvailable(req, res, next) {
  if (res.locals.table.reservation_id) {
    next({
      status: 400,
      message: `Table id is occupied: ${res.locals.table.table_id}`,
    });
  } else {
    next();
  }
}

function reservationStatusIsBooked(req, res, next) {
  if (res.locals.reservation.status === "booked") {
    next();
  } else {
    next({
      status: 400,
      message: `Reservation status must be 'booked'. It is ${res.locals.reservation.status}.`,
    });
  }
}

function hasCapacityForReservation(req, res, next) {
  if (res.locals.table.capacity < res.locals.reservation.people) {
    next({
      status: 400,
      message: `Table does not have enough capacity. Seating for ${res.locals.reservation.people} is needed.`,
    });
  } else {
    next();
  }
}

async function create(req, res) {
  const data = await service.create(req.body.data, req.log);
  res.status(201).json({
    data: data,
  });
}

async function list(req, res) {
  const data = await service.list(req.query.date, req.log);
  res.json({
    data,
  });
}

async function seat(req, res) {
  const data = await service.seat(
    res.locals.table.table_id,
    res.locals.reservation.reservation_id
  );
  res.json({
    data,
  });
}

function tableIsOccupied(req, res, next) {
  if (res.locals.table.reservation_id) {
    next();
  } else {
    next({
      status: 400,
      message: `Table is not occupied: ${res.locals.table.table_id}`,
    });
  }
}

async function finish(req, res) {
  const data = await service.finish(res.locals.table);

  res.json({
    data,
  });
}

module.exports = {
  create: asyncErrorBoundary(create),
  list: asyncErrorBoundary(list),
  seat: [
    asyncErrorBoundary(tableExists),
    tableIsAvailable,
    hasCapacityForReservation,
    reservationStatusIsBooked,
    asyncErrorBoundary(seat),
  ],
  finish: [
    asyncErrorBoundary(tableExists),
    tableIsOccupied,
    asyncErrorBoundary(finish),
  ],
};
