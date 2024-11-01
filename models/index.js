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

const fetchTableData = () => {
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

  const tableArr = fetchTableData();

  console.log(tableArr);
  return tableArr;
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
  const tableArr = fetchTableData();
  return tableArr;
}

module.exports = {
  handleSearch,
  handleRemoveFilter,
};
