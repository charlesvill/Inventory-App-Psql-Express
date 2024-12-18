const pool = require("./pool.js");
const model = require("../models/index.js");

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
  // ** this is where I left off
  // maybe check if there are rows and bounce the adding the id. 
  // I need to redraw out the passage of data, and how the model queries and 
  // decides what will be 
  let manId = await pool.query('SELECT id FROM manufacturers WHERE name = ($1)', [fields.manufacturer]);

  console.log(manId);

  if (manId.rows.length < 1) {
    const { rows } = await pool.query(`INSERT INTO manufacturers (name) VALUES ($1) RETURNING id;`, [fields.manufacturer]);
    console.log("id of the newly created manufacturer is: ", rows[0].id);

    manId = rows[0].id;
  } else {
    manId = manId.rows[0].id;
  }

  console.log(manId);


  const powerPlantId = await pool.query('SELECT id from powerplants WHERE powerplant = ($1)', [fields.powerplant]);
  const scaleId = await pool.query('SELECT id from scales WHERE scale = ($1)', [fields.scale]);
  const terrainId = await pool.query('SELECT id from terrains WHERE terrain = ($1)', [fields.terrain]);
  console.log("the terrain id is: ", terrainId.rows);

  const carQuery = `INSERT INTO cars (
    name, 
    description, 
    img_url, 
    manufacturer_id, 
    powerplant_id, scale_id, 
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
      manId,
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
  ${model}.name,
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

async function selectModelByBrand(brand, modelTable, brandTable, column) {

  const brandQuery = `
  SELECT name, id FROM ${brandTable}
  WHERE name = '${brand}';
  `
  const brandRows = await pool.query(brandQuery);
  if (brandRows.rows.length < 1) {
    // false for brand not found
    return {
      modelFound: false,
      brandFound: false,
      rows: null
    };
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
  // should check if the model was found return 
  if (rows.length < 1) {
    return {
      modelFound: false,
      brandFound: true,
      rows: null
    };
  }
  return {
    modelFound: true,
    brandFound: true,
    rows: rows
  };
}


async function queryModelFieldsById(modelType, id) {
  // Query the main table to get the row by id
  const { rows } = await pool.query(`SELECT * FROM ${modelType} WHERE id = $1`, [id]);
  const allColumns = rows[0];

  console.dir("all columns: ", allColumns);
  if (!allColumns) {
    throw new Error(`No record found for ${modelType} with id ${id}`);
  }

  // Create an array of keys ending in "_id"
  const keysEndingWithId = Object.keys(allColumns).filter(key => key.endsWith("_id"));
  console.log("array of id keys: ", keysEndingWithId);

  // Map over the keys and construct a promise for each query
  const promises = keysEndingWithId.map(async (key) => {
    const tableCode = key.charAt(0); // Get the table code (assumes first character indicates the table)
    const tableData = model.dataByCode(tableCode); // Map the code to the corresponding table

    console.log("current key:", key);
    console.log("tableCode:", tableCode);
    console.log("tableData:", tableData);

    // Build the query statement dynamically
    const queryStatement = `
      SELECT * FROM ${tableData.table}
      WHERE id = $1
    `;
    console.log("the current table statement", queryStatement);

    console.log("id number ", allColumns[key]);
    const { rows: keyRows } = await pool.query(queryStatement, [allColumns[key]]);
    return { [key]: keyRows[0] }; // Return an object with the key and its value
  });

  // Use Promise.all to resolve all the promises in parallel
  const results = await Promise.all(promises);

  // Merge all the resulting objects into a single object
  const fieldsObj = results.reduce((acc, obj) => {
    return { ...acc, ...obj };
  }, {});

  console.log("fieldsObj:", fieldsObj);
  return fieldsObj;
}


async function example() {
  const test = await queryModelFieldsById("cars", 8);
  setTimeout(async () => {
    console.dir("test results: ", test);
  }, 2000);
}

example();

module.exports = {
  selectAllOfType,
  selectAll,
  selectTableRows,
  selectDropDownFields,
  insertCarFields,
  selectByFilter,
  selectModelByBrand
};
