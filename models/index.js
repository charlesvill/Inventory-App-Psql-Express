const db = require("../db/queries.js");

const tableData = [
  {
    m: {
      fieldName: 'Brand',
      table: 'manufacturers',
      column: 'name',
      id: 'id',
      modelId: 'manufacturer_id',
      distinct: false,
    }
  },
  {
    p: {
      fieldName: 'Power plant',
      table: 'powerplants',
      column: 'powerplant',
      id: 'id',
      modelId: 'powerplant_id',
      distinct: true
    }
  },
  {
    s: {
      fieldName: 'Scale',
      table: 'scales',
      column: 'scale',
      id: 'id',
      modelId: 'scale_id',
      distinct: false
    }
  },
  {
    t: {
      fieldName: 'Terrain',
      table: 'terrains',
      column: 'terrain',
      id: 'id',
      modelId: 'terrain_id',
      distinct: false
    }
  },
  {
    //this is broken. cars table doesnt have skill_id
    //currently skill table references cars not the other way around
    l: {
      fieldName: 'Skill Level',
      table: 'skill_levels',
      column: 'skill_level',
      id: 'id',
      modelId: 'skill_id',
      distinct: true
    }
  }
];


let filters = [];

function filterArrAdjust(code) {
  const table = code.charAt(0);
  const value = code.slice(1);

  for (let i = 0; i < filters.length; i++) {
    const elemTable = filters[i].charAt(0);
    const elemVal = filters[i].slice(1);

    if (elemTable === table) {
      if (value === elemVal) {
        return; // Code already exists, so exit without pushing
      } else {
        filters[i] = code; // Update the element directly
        return;
      }
    }
  }

  // If no matching element was found, add the new code
  filters.push(code);
}



function dataByCode(code) {
  const foundEntry = tableData.find(
    element => element.hasOwnProperty(code)
  );
  if (!foundEntry) {
    throw new Error(
      `could not match code selector with a table! code: ${code}`
    );
  }
  const tableInfo = foundEntry[code];

  return tableInfo;
}

const fetchTableData = () => {
  let tableArr = [];
  filters.forEach((filter) => {
    const selector = filter.charAt(0);
    const value = filter.slice(1);
    try {

      const tableInfo = dataByCode(selector);

      tableArr.push({
        table: tableInfo.table,
        column: tableInfo.column,
        id: tableInfo.id,
        modelId: tableInfo.modelId,
        value: value
      });
    } catch (err) {
      console.error(err)
    }
  });
  console.log("tablearr: ", tableArr);
  return tableArr;
}

function handleSearch(code) {
  // code e.g m3 parsed into 'm' and '3' which returns 
  // obj with table and column name with the value 3 to query

  // checks if code present in filters array and adds if not
  // allows for stringing of multiple filters w/o repeating same filters

  //checks if filter already present and adds if not
  filterArrAdjust(code);

  filters.forEach((filter, index) => {
    console.log('filter ', index, ' ', filter)
  });

  const tableData = fetchTableData();

  console.log(tableData);
  return { tableData, filters };
}

function handleRemoveFilter(code) {
  // check to see that it is present in the filter arr

  try {
    const newArr = filters.filter(element => element !== code);
    filters = newArr;
    console.log("the filters are: ", filters);

  } catch (err) {
    console.error(err)
    return;
  }

  // fetch the table data 
  const tableData = fetchTableData();
  return { tableData, filters };
}

async function fetchFieldData() {
  let fetchData = [];

  for (const object of tableData) {
    const key = Object.keys(object)[0];
    const value = Object.values(object)[0];
    console.log(key);
    const fieldName = value.fieldName;
    const table = value.table;
    const idColName = value.id;
    console.log(idColName);
    const column = value.column;
    const distinct = value.distinct;

    const rows = await db.selectTableRows(table, column, idColName, distinct);
    const code = key.charAt(0) + rows[0][idColName];

    fetchData.push({
      [key]: {
        fieldName: fieldName,
        table: table,
        column: column,
        distinct: distinct,
        code: code,
        rows: [...rows]
      }
    });
  }

  console.log(fetchData);

  fetchData.forEach(element => console.log(Object.values(element)[0].rows));
  return fetchData;
}

async function duplicateCheck(modelName, modelBrand, modelType) {
  // conditional branching
  const search = await db.selectModelByBrand(modelBrand, modelType, "manufacturers", "name");
  console.log(search);

  if (!search.modelFound || !search.brandFound) {
    return search;
  }

  const found = search.rows.find(model => model.name === modelName);

  if (found) {
    console.log("model was found");
    return {
      ...search,
      modelId: found.id,
    }
  }

  console.log("model was found and brand was found but searching rows was not successful");
  return search;
}

async function modelDataById(modelType, id) {
  // get all columns from db by model id
  const allColumns = await db.selectFromModelId(modelType, id);

  // create the array of keys ending in "_id"
  const keysEndingWithId = Object.keys(allColumns).filter(key => key.endsWith("_id"));
  console.log("array of id keys: ", keysEndingWithId);

  // reduce over the keys and create a promise for each query or create a large join statement 


  const baseStatement = `SELECT * FROM ${modelType}`;

  const joinStatement = keysEndingWithId.reduce((acc, key) => {

    //gives the name of the table
    const tableName = dataByCode(key.charAt(0)).table;

    const newJoin = `JOIN ${tableName} ON ${modelType}.${key} = ${tableName}.id`;

    return acc + " " + newJoin;
  }, baseStatement);

  const finalStatement = joinStatement + ` WHERE ${modelType}.id = $1`;

  console.log("final query statement for model: ", finalStatement);

  // use db to query the final statement and return the result or return the query statement
  // adn use the controller that called this method to call the db. 
}

modelDataById("cars", 8);

module.exports = {
  handleSearch,
  handleRemoveFilter,
  dataByCode,
  fetchFieldData,
  duplicateCheck,
};
