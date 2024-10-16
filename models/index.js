const tableData = [
  {
    m: {
      table: 'manufacturers',
      column: 'name',
      id: 'manufacturer_id'
    }
  },
  {
    p: {
      table: 'powerplants',
      column: 'powerplant',
      id: 'id'
    }
  },
  {
    s: {
      table: 'scales',
      column: 'id'
    }
  },
  {
    t: {
      table: 'terrains',
      column: 'id'
    }
  },
];

function handleSearch(code) {
  // code e.g m3 parsed into 'm' and '3' which returns 
  // obj with table and column name with the value 3 to query
  const selector = code.charAt(0);
  const value = code.slice(1);

  try {
    const foundEntry = tableData.find(element => element.hasOwnProperty(selector));
    if(!foundEntry){
          throw new Error('could not match code selector with a table');
    } 
    const tableInfo = foundEntry[selector];

    return {
      table: tableInfo.table,
      column: tableInfo.column,
      value: value
    }
  } catch (err) {
    console.error(err)
  }
}

module.exports = {
  handleSearch
};
