const pool = require("./pool.js");

async function selectAllOfType(category) {
  const { rows } = await pool.query(
    "SELECT * FROM $1", [category]
  );
  return rows;
}

async function selectAll(model) {
  const query = `SELECT * FROM ${model}`
  const { rows } = await pool.query(query);

  return rows;
}

module.exports = {

  selectAllOfType,
  selectAll

};
