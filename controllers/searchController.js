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

async function getByFilters(req, res) {
  const searchCode = req.params.category;

  // this skips stray static asset requests to avoid throwing errors

  // refactor this that we should input the code and the model 
  // should output the query and the send the query to get the 
  // results back.

  // model should return the table information for the codes
  // does this handle more than one?

  const tableData = model.handleSearch(searchCode)
  console.log(tableData);
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
  getByFilters
};
