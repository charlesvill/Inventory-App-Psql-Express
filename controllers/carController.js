const db = require("../db/queries.js");
const model = require("../models/index.js");


// edit controller
async function editModel(req, res) {
  // get all the fields
  const fields = db.
  // get form
  // respond w/ data passed through
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
