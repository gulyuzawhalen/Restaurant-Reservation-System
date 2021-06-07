const knex = require("../db/connection");
const tableName = "reservations";

const validDate = /\d\d\d\d-\d\d-\d\d/;
const validTime = /\d\d:\d\d/;
const validStatus = ["booked", "seated", "finished", "cancelled"];

const CLOSED_DAYS = [2]; // 0 - Sunday, 1 - Monday, 2 - Tuesday, 3 - Wednesday, 4 - Thursday, 5 - Friday, 6 - Saturday

function create(reservation) {
    return knex(tableName)
    .insert(reservation, "*")
    .then(createdRecords => createdRecords[0]);
}

function list(date) {
    return knex(tableName)
      .where("reservation_date", date)
      .whereNotIn("status", ["finished", "cancelled"])
      .orderBy("reservation_time");
}

function read(reservation_id) {
    return knex(tableName).where({ reservation_id }).first()
}

module.exports = {
    create,
    list,
    read,
};

