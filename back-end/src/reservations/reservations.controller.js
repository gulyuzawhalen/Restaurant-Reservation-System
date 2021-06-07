/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  const data = await service.list();
  res.json({data: [] })
}

async function create(req, res) {
    const newReservation = ({
      reservation_id,
      first_name,
      last_name,
      mobile_number,
      reservation_date,
      reservation_time,
      people,
      created_at,
      updated_at,
    } = req.body.data);
  const createdReservation = await service.create(newReservation);
  res.status(201).json({ data: createdReservation });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: asyncErrorBoundary(create),
};
