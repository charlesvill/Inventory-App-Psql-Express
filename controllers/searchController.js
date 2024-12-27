const db = require("../db/queries.js");
const model = require("../models/index.js");

// need to see what is the best way to trigger 
// fetch field data withough redundant queries


async function getAll(req, res, radioModelType) {
  const query = await db.selectAll(radioModelType);
  const fieldData = await model.fetchFieldData();

  res.render("search", {
    page: "results",
    content: query,
    fieldData: fieldData
  });
}

async function getByType(req, res) {
  const category = req.params.model;
  const query = await db.selectAllOfType(category);
  const fieldData = await model.fetchFieldData();

  res.render("search", {
    page: "results",
    content: query,
    fieldData: fieldData
  });
}

let filterArr = [];

async function addFilter(req, res) {
  const searchCode = req.params.category;

  const data = model.handleSearch(searchCode);
  const tableData = data.tableData;
  //filters need to be passed to query to get labels as well
  const query = await db.selectByFilter(
    "cars",
    tableData,
  );
  const fieldData = await model.fetchFieldData();

  console.log("query is: ", query);
  res.render("search", {
    page: "results",
    content: query,
    fieldData: fieldData
  });
}

async function removeFilter(req, res) {

  const filter = req.params.category;
  const data = model.handleRemoveFilter(filter);
  const tableData = data.tableData;

  if(tableData.length < 1){
    return getAll(req, res, "cars");
  }

  const query = await db.selectByFilter(
    "cars",
    tableData
  );
  const fieldData = await model.fetchFieldData();

  res.render("search", {
    page: "results",
    content: query,
    fieldData: fieldData
  });
}


module.exports = {
  getAll,
  getByType,
  addFilter,
  removeFilter,
};
