const db = require("../db/queries.js");
const model = require("../models/index.js");



async function getAll(req, res, model) {
  const query = await db.selectAll(model);

  res.render("search", {
    page: "results",
    content: query
  });
}

async function getByType(req, res) {
  const category = req.params.model;
  const query = await db.selectAllOfType(category);

  res.render("search", {
    page: "results",
    content: query
  });
}

async function addFilter(req, res) {
  const searchCode = req.params.category;

  const tableData = model.handleSearch(searchCode)
  console.log(tableData);
  const query = await db.selectByFilter("cars", tableData);
  console.dir(query);
  res.render("search", {
    page: "results",
    content: query
  });
}
async function removeFilter(req, res) {
  
  const filter = req.params.category;
  const tableData = model.handleRemoveFilter(filter);
  console.dir(tableData);

  const query = await db.selectByFilter("cars", tableData);

  console.dir(query);
  res.render("search", {
    page: "results", 
    content: query
  });
}


module.exports = {
  getAll,
  getByType,
  addFilter,
  removeFilter,
};
