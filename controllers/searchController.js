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
  const result = model.handleSearch(searchCode)
  console.log('param is: ', searchCode);
  console.log(result);
  const query = await db.selectByFilter("cars", result);
  console.log("this should be after the")
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
