const pool = require("./pool.js");

async function selectAllOfType(category) {
  const { rows } = await pool.query(
    "SELECT * FROM $1", [category]
  );
  return { rows };
}


async function selectAll(model) {
  const query = `SELECT * FROM ${model}`
  const { rows } = await pool.query(query);

  return { rows };
}

async function selectTableRows(table, column, id, distinct = false) {
  const query = `SELECT ${distinct ? "DISTINCT" : ""} ${column}, ${id} FROM ${table}`;
  console.log(query);

  const { rows } = await pool.query(query);

  return rows;
}

async function selectDropDownFields() {
  const names = await pool.query('SELECT name FROM cars ORDER BY name ASC');
  const brands = await pool.query('SELECT id, name FROM manufacturers');
  const scales = await pool.query('SELECT id, scale FROM scales');
  const terrains = await pool.query('SELECT id, terrain FROM terrains');
  const powerPlants = await pool.query('SELECT DISTINCT powerplant FROM powerplants');
  // const skillLevels = await pool.query('SELECT DISTINCT skill_level FROM skill_levels');

  return {
    names: names.rows,
    brands: brands.rows,
    scales: scales.rows,
    terrains: terrains.rows,
    powerplants: powerPlants.rows,
    // skill_levels: skillLevels.rows
  };
}

async function insertCarFields(fields) {
  console.log(fields);
  // man id
  // powerplant id
  // scale id
  // terrain id
  // for when working with adding new manufacturer, need new procedure. 
  // either get man Id or just insert 
  const manId = await pool.query('SELECT id FROM manufacturers WHERE name = ($1)', [fields.manufacturer]);

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
      manId.rows[0].id,
      powerPlantId.rows[0].id,
      scaleId.rows[0].id,
      terrainId.rows[0].id
    ]);
}
async function queryLabels(tableInfo) {
  console.log("table info in query labels: ", tableInfo);
  let labels = [];
  for (let i = 0; i < tableInfo.length; i++) {
    const element = tableInfo[i];
    const table = element.table;
    const column = element.column;
    const value = element.value;
    const id = element.id;
    const query = `SELECT ${column} AS label, ${id} FROM ${table} WHERE ${id} = ${value}`;
    console.log("query for label is : ", query);

    const { rows } = await pool.query(query);
    console.log("label rows: ", rows);
    const label = rows[0].label;
    const code = element.table.charAt(0) + rows[0][id];
    console.log("code for this label is: ", code);
    console.log("current label is: ", label);
    labels.push({ label, code });
  }
  return labels;
}
// this is going to be an array of table info
async function selectByFilter(model, tableInfo) {
  const tableData = tableInfo;
  const labels = await queryLabels(tableInfo);
  const firstFilter = tableData.shift();
  const baseQuery = `
  SELECT ${firstFilter.table}.${firstFilter.column} AS label,   
  cars.name,
  ${model}.description,
  ${model}.img_url
  FROM ${model} 
  JOIN ${firstFilter.table} on (
  ${model}.${firstFilter.modelId} = ${firstFilter.table}.${firstFilter.id}
  )
  WHERE ${firstFilter.modelId} = ${firstFilter.value} 
  `;
  console.log("baseQuery is: ", baseQuery);

  if (tableData.length < 1) {
    const { rows } = await pool.query(baseQuery);
    return { rows, labels };
  }


  const multiQuery = tableInfo.reduce((acc, currentElem) => {
    return acc + ` AND ${currentElem.modelId} = ${currentElem.value}`
  }, baseQuery);

  console.log(multiQuery);
  const { rows } = await pool.query(multiQuery);
  return { rows, labels };
}

async function selectModelByBrand(brand, modelTable, brandTable, column){

  const brandQuery = `
  SELECT name, id FROM ${brandTable}
  WHERE name = '${brand}';
  `
  const brandRows = await pool.query(brandQuery);
  if(brandRows.length < 1){
    return false;
  }
  const id = brandRows.rows[0].id;

  // otherwise store the id for the brand
  const modelQuery = `
  SELECT ${column} FROM ${modelTable} 
  WHERE id IN (
      SELECT id from ${brandTable}
      WHERE id = ${id}
    ) 
  `;

  const { rows } = await pool.query(modelQuery);
  return rows;
}
module.exports = {
  selectAllOfType,
  selectAll,
  selectTableRows,
  selectDropDownFields,
  insertCarFields,
  selectByFilter,
  selectModelByBrand
};
