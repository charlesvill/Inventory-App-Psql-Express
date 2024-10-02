const db = require('../db/queries.js');


async function getAddForm(req, res) {

  const dropLists = await db.selectDropDownFields();

  dropLists.brands.map(element => console.log(element));

  res.render("add", {
    data: dropLists
  });
}

module.exports = getAddForm;
