const pool = require("./pool.js");

async function testQuery() {
  const { rows } = await pool.query(
    "SELECT * FROM cars WHERE manufacturer_id IN (SELECT manufacturer_id FROM manufacturers WHERE name = 'Kyosho')"
  );
  return rows;
}

module.exports = testQuery;
