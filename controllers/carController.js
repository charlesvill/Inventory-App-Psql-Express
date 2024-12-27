const db = require("../db/queries.js");
const model = require("../models/index.js");

// edit controller
async function editModel(req, res) {
  const id = req.params.id;

  const fields = await model.modelDataById("cars", id);
  console.log("fields being sent: ", fields);


  res.render("edit", {
    data: fields,
  });

}

// publish edits controller
async function publishEdits(req, res) {
  // get all the fields from name
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
