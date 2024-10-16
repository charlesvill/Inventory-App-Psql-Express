const { Router } = require("express");
const searchController = require("../controllers/searchController.js");
const carRouter = Router();


carRouter.get("/", (req, res) => {
  searchController.getAll(req, res, "cars");
});

// route for searching
carRouter.get("/search/:category", (req, res) => {
  console.log("a request has come through for, ", req.params.category);
  searchController.getByFilters(req, res);
});
// separate path for the search bar queries because 
// it will use different type of db query

//this routing needs work because stylesheets are coming through as requests to this handle. 
//need also add validation before sending to the model.

module.exports = carRouter;



