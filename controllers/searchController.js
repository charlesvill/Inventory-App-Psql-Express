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

function paramValidator(param) {
  const value = Number(param.slice(1));
  console.log('value is', value);
  if (isNaN(value)) {
    return false;
  } else {
    return true;
  }
}

async function getByFilters(req, res) {
  const searchCode = req.params.category;
  const validator = paramValidator(searchCode);
  console.log("is the parameter valid? ", validator);
  // this skips stray static asset requests to avoid throwing errors

  if (!validator) {
    return res.status(400).json({ error: "Invalid search parameter" });
  }

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
