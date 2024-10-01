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
  const { rows } = await pool.query('SELECT DISTINCT name FROM manufacturers');
  // const scales = await pool.query('SELECT DISTINCT scale FROM scales');
  // const terrains = await pool.query('SELECT DISTINCT terrain FROM terrains');
  // const powerPlants = await pool.query('SELECT DISTINCT power_plant FROM power_plants');
  // const skillLevels = await pool.query('SELECT DISTINCT skill_level FROM skill_levels');

  return {
    brands: rows,
    // scales: scales,
    // terrains: terrains,
    // powerPlants: powerPlants,
    // skillLevels: skillLevels
  };
}

module.exports = {

  selectAllOfType,
  selectAll,
  selectDropDownFields,
};
