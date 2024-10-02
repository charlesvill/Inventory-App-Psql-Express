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

async function selectDropDownFields() {
  const brands = await pool.query('SELECT DISTINCT name FROM manufacturers');
  const scales = await pool.query('SELECT DISTINCT scale FROM scales');
  const terrains = await pool.query('SELECT DISTINCT terrain FROM terrains');
  const powerPlants = await pool.query('SELECT DISTINCT powerplant FROM powerplants');
  const skillLevels = await pool.query('SELECT DISTINCT skill_level FROM skill_levels');

  return {
    brands: brands.rows,
    scales: scales.rows,
    terrains: terrains.rows,
    powerplants: powerPlants.rows,
    skill_levels: skillLevels.rows
  };
}

module.exports = {
  selectAllOfType,
  selectAll,
  selectDropDownFields,
};
