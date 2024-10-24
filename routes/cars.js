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


module.exports = carRouter;



