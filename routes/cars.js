const { Router } = require("express");
const searchController = require("../controllers/searchController.js");
const carRouter = Router();


carRouter.get("/", (req, res) => {
  searchController.getAll(req, res, "cars");
});

// maybe a path for the established categories
carRouter.get("/:model", (req, res) => {
  //controller that will db the needed shit
});
// separate path for the search bar queries because 
// it will use different type of db query


module.exports = carRouter;


