/**
 * List handler for reservation resources
 */
 const service = require("./reservations.service");
 const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
 
 async function hasReservationId(req, res, next) {
   const reservation_id = req.params.reservation_id || req.body?.data?.reservation_id;
   if (reservation_id) {
     res.locals.reservation_id = reservation_id;
     next();
   } else {
     next({
       status: 400,
       message: `reservation_id is required`
     })
   }
 }
 
 async function reservationExists(req, res, next) {
   const reservation_id = res.locals.reservation_id;
   const reservation = await service.read(reservation_id);
   if (reservation) {
     res.locals.reservation = reservation;
     next();
   } else {
     next({
       status: 404,
       message: `Reservation id does not exist: ${reservation_id}`,
     })
   }
 }
 
 async function create(req, res) {
   // const newReservation = ({
   //   reservation_id,
   //   first_name,
   //   last_name,
   //   mobile_number,
   //   reservation_date,
   //   reservation_time,
   //   people,
   //   created_at,
   //   updated_at,
   // } = req.body.data);
   // const createdReservation = await service.create(newReservation);
   //res.status(201).json({ data: createdReservation });
   
   const data = await service.create(req.body.data);
   res.status(201).json({ data: data, })
 }
 
 async function list(req, res) {
   const data = await (req.query.mobile_number
     ? service.search(req.query.mobile_number, req.log)
     : service.list(req.query.date, req.log));
 
   res.json({
     data,
   });
 }
 
 async function read(req, res) {
   const data = res.locals.reservation;
   res.json({
     data,
   });
 }
 
 async function update(req, res) {}
 
 async function status(req, res) {
   res.locals.reservation.status = req.body.data.status;
   const data = await service.status(res.locals.reservation);
   res.json({ data });
 }
 async function statusIsNotFinished(req, res, next) {
   if ("finished" === res.locals.reservation.status) {
     next({
       status: 400,
       message: `Reservation status is 'finished', no changes can be made.`,
     });
   } else {
     next();
   }
 }

  async function statusIsBooked(req, res, next) {
    if ("booked" === res.locals.reservation.status) {
      next({
        status: 400,
        message: `Reservation status is '${res.locals.reservation.status}', no changes can be made.`,
      });
    } else {
      next();
    }
  }
 
 module.exports = {
   create: asyncErrorBoundary(create),
   list: asyncErrorBoundary(list),
   read: [hasReservationId, asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
   reservationExists: [hasReservationId, asyncErrorBoundary(reservationExists)],
   status: [hasReservationId, asyncErrorBoundary(reservationExists), statusIsNotFinished, asyncErrorBoundary(status)],
   update: [hasReservationId, asyncErrorBoundary(reservationExists), statusIsBooked, asyncErrorBoundary(update)],
 };
 