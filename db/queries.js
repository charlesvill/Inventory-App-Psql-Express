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
  const brands = await pool.query('SELECT manufacturer_id, name FROM manufacturers');
  const scales = await pool.query('SELECT id, scale FROM scales');
  const terrains = await pool.query('SELECT id, terrain FROM terrains');
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

async function insertCarFields(fields) {
  console.log(fields);
  // man id
  // powerplant id
  // scale id
  // terrain id
  const manId = await pool.query('SELECT manufacturer_id FROM manufacturers WHERE name = ($1)', [fields.manufacturer]);
  const powerPlantId = await pool.query('SELECT id from powerplants WHERE powerplant = ($1)', [fields.powerplant]);
  const scaleId = await pool.query('SELECT id from scales WHERE scale = ($1)', [fields.scale]);
  const terrainId = await pool.query('SELECT id from terrains WHERE terrain = ($1)', [fields.terrain]);
  console.log("the terrain id is: ", terrainId.rows);

  const carQuery = `INSERT INTO cars (
    name, 
    description, 
    img_url, 
    manufacturer_id, 
    powerplant_id, scales_id, 
    terrain_id
    ) VALUES (
    $1, $2, $3, $4, $5, $6, $7)
     `;
  console.log(carQuery);
  console.log(fields.img_url);
  await pool.query(carQuery,
    [
      fields.name,
      fields.description,
      fields.img_url,
      manId.rows[0].manufacturer_id,
      powerPlantId.rows[0].id,
      scaleId.rows[0].id,
      terrainId.rows[0].id
    ]);
}
// this is going to be an array of table info
async function selectByFilter(model, tableInfo) {
  const tableData = tableInfo;
  const firstTable = tableData.shift();
  const baseQuery = `
  SELECT * FROM ${model} 
  WHERE ${firstTable.column} = ${firstTable.value} 
  `;

  if(tableData.length < 1 ) {
    const { rows } = await pool.query(baseQuery);
    return rows;
  }


  const multiQuery = tableInfo.reduce((acc, currentElem) => {
    return acc + ` AND ${currentElem.column} = ${currentElem.value}`
  }, baseQuery);

  console.log(multiQuery);
  const { rows } = await pool.query(multiQuery);
  return rows;
}


async function selectByMultiFilters(model, tableArr){

  //frame fn = arr.shift()
  //others = arr.reduce((accumulator, currElem) => 
  //return acc + "and" + currElem)

  // combine the firsta nd the last ones and test. 

}


module.exports = {
  selectAllOfType,
  selectAll,
  selectDropDownFields,
  insertCarFields,
  selectByFilter
};
