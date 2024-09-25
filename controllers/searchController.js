const testQuery = require("../db/queries.js");

async function testGetCars(req, res) {
  const query = await testQuery();

  res.render("search", {
    page: "results",
    content: query 
  });
}


module.exports = testGetCars;
