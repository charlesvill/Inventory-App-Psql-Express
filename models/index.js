const tableData = [
  {
    m: {
      table: 'manufacturers',
      column: 'manufacturer_id',
      id: 'manufacturer_id'
    }
  },
  {
    p: {
      table: 'powerplants',
      column: 'powerplant_id',
      id: 'id'
    }
  },
  {
    s: {
      table: 'scales',
      column: 'scales_id'
    }
  },
  {
    t: {
      table: 'terrains',
      column: 'terrain_id',
      id: 'id'
    }
  },
];

let filters = [];

function handleSearch(code) {
  // code e.g m3 parsed into 'm' and '3' which returns 
  // obj with table and column name with the value 3 to query

  // checks if code present in filters array and adds if not
  // allows for stringing of multiple filters w/o repeating same filters

  function repeatFilterCheck() {
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

  // Usage
  repeatFilterCheck("yourCodeHere"); // Call with the desired code


  filters.forEach((filter, index) => {
    console.log('filter ', index, ' ', filter)
  });

  let tableArr = [];

  filters.forEach((filter) => {
    const selector = filter.charAt(0);
    const value = filter.slice(1);
    try {
      const foundEntry = tableData.find(
        element => element.hasOwnProperty(selector)
      );
      if (!foundEntry) {
        throw new Error(
          `could not match code selector with a table! code: ${filter.code}`
        );
      }
      const tableInfo = foundEntry[selector];

      tableArr.push({
        table: tableInfo.table,
        column: tableInfo.column,
        value: value
      });
    } catch (err) {
      console.error(err)
    }
  });

  console.log(tableArr);
  return tableArr;

}

module.exports = {
  handleSearch
};
