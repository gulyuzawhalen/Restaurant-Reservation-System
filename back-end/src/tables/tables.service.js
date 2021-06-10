const knex = require("../db/connection");
const hasProperties = require("../errors/hasProperties")
const hasMinLength = require("../errors/hasMinLength");

const tableName = "tables";

function capacityIsGreaterThanZero(table = {}) {
  const { capacity } = table;
  if (Number.isInteger(capacity) && capacity > 0) {
    return table;
  }
  const error = new Error(
    `The 'capacity' property must be a number greater than zero: ${capacity}`
  );
  error.status = 400;
  throw error;
}

function create(newTable) {
  return knex(tableName)
    .insert(newTable, "*")
    .then((savedTables) => savedTables[0]);
}

function list() {
  return knex(tableName).orderBy("table_name");
}

function read(table_id) {
  return knex(tableName).where({ table_id }).first();
}

function update(updatedTable) {
  return knex(tableName)
    .where({ table_id: updatedTable.table_id })
    .update(updatedTable, "*")
    .then((records) => records[0]);
}

function seat(table_id, reservation_id, ) {
  return knex.transaction(async (transaction) => {
    await knex("reservations")
      .where({ reservation_id })
      .update({ status: "seated" })
      .transacting(transaction);

    return knex("tables")
      .where({ table_id })
      .update({ reservation_id }, "*")
      .transacting(transaction)
      .then((records) => records[0]);
  });
}

function finish(table) {
  return knex.transaction(async (transaction) => {
    await knex("reservations")
      .where({ reservation_id: table.reservation_id })
      .update({ status: "finished" })
      .transacting(transaction);

    return knex("tables")
      .where({ table_id: table.table_id })
      .update({ reservation_id: null }, "*")
      .transacting(transaction)
      .then((records) => records[0]);
  });
}

const validTableComps = (
  capacityIsGreaterThanZero,
  hasMinLength("table_name", 2),
  hasProperties("table_name")
);

module.exports = {
  create: [create, validTableComps],
  finish,
  list,
  read,
  seat,
  update: [update, validTableComps],
};