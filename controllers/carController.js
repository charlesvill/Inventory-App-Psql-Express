const db = require("../db/queries.js");
const model = require("../models/index.js");

// edit controller
async function editModel(req, res) {
  const id = req.params.id;

  const fields = await model.modelDataById("cars", id);
  const dropDownFields = await db.selectDropDownFields();

  console.log("fields being sent: ", fields);


  res.render("edit", {
    data: fields,
    dropDown: dropDownFields,
  });

}

// publish edits controller
async function publishEdits(req, res) {
  // get all the fields from name
  // pass through mw to check for duplicates
  // send back to the edits if its the same
  // reference db queries method to post chnages, pass data
  // reroute to select all
}

// profile controller
//
// get all the fields
// get profile ejs
// respond w/ data passed through

module.exports = {
  editModel,
  publishEdits
}
