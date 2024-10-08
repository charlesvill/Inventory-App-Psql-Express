const db = require("../db/queries.js");


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


module.exports = {
  getAll,
  getByType,
};
