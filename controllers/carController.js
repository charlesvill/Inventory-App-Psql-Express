const db = require("../db/queries.js");
const model = require("../models/index.js");

// edit controller
async function editModel(req, res) {
  const id = req.params.id;

  const fields = await model.modelDataById("cars", id);
  const dropDownFields = await db.selectDropDownFields();

  // console.log("fields being sent: ", fields);


  res.render("edit", {
    data: fields,
    dropDown: dropDownFields,
  });

}

// publish edits controller
async function publishEdits(req, res) {
  // get all the fields req.body
  const {
    name,
    manufacturer_id,
    description,
    img_url,
    scale_id,
    terrain_id,
    powerplant_id,
  } = req.body;

  console.log("the publish edits controller is being activated");

  const id = req.params.id;
  const updateData = model.genUpdateStatement(
    "cars",
    id,
    {
      name,
      description,
      img_url,
    },
    {
      manufacturer_id,
      scale_id,
      terrain_id,
      powerplant_id
    }
  );
  console.log(updateData);

  const dbResults = await db.queryByStatement(updateData.statement, ...updateData.valuesArray);
  console.log("db results for update", dbResults);

  res.redirect(`/cars/profile/${id}`);
}

// profile controller
//
// get all the fields
// db methods will be the same as the edit methods. just get all fields for that car. 
// get profile ejs
// respond w/ data passed through

async function viewProfile(req, res) {
  const id = req.params.id;
  const fields = await model.modelDataById("cars", id);

  res.render("profile",
    {
      data: fields
    });
}

module.exports = {
  editModel,
  publishEdits,
  viewProfile
}
