const db = require('../db/queries.js');
const model = require('../models/index.js');

async function getAddForm(req, res) {

  // may need to refactor db method to be model agnostic
  // would not work for planes as it stands
  const dropLists = await db.selectDropDownFields();

  dropLists.brands.map(element => console.log(element));
  dropLists.names.map(element => console.log(element));
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


  const ableToAdd = await model.duplicateCheck(name, manufacturer, "cars");
  if (ableToAdd) {
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

  } else {
    console.log("the model already exists, it should redirect");
    console.dir(ableToAdd[0]);
    res.send("This is a redirect to edit!");
  }
  // controller will either direct to add the car or edit page
  // model method will return false for add or true for edit



  // get all the forms 
  // pass data to query
  // build query fn to make all database changes

}

module.exports = {
  getAddForm,
  addCar
};
