const db = require('../db/queries.js');


async function getAddForm(req, res) {

  const dropLists = await db.selectDropDownFields();

  dropLists.brands.map(element => console.log(element));
  dropLists.scales.map(element => console.log(element));
// { manufacturer_id: 1, name: 'Kyosho' }
// { manufacturer_id: 2, name: 'HPI' }
// { manufacturer_id: 1, name: 'Kyosho' }
// { manufacturer_id: 2, name: 'HPI' }


  res.render("add", {
    data: dropLists
  });
}

async function addCar(req, res) {

  const {
    name,
    manufacturer,
    description,
    img_url,
    scale,
    terrain,
    powerplant,
    skill_level,
    skill_description
  } = req.body;

  console.log(img_url);
  db.insertCarFields(
    {
      name,
      manufacturer,
      description,
      img_url,
      scale,
      terrain,
      powerplant,
      skill_level,
      skill_description
    }
  );

  res.redirect("/");


  // get all the forms 
  // pass data to query
  // build query fn to make all database changes

}

module.exports = {
  getAddForm,
  addCar
};
