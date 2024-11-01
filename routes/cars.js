const { Router } = require("express");
const searchController = require("../controllers/searchController.js");
const carRouter = Router();

const searchValidator = (req, res, next) => {
  const value = Number(req.params.category.slice(1));
  console.log('value is', value);
  if (isNaN(value)) {
    console.log("there should be an error triggering")
    throw new Error("Invalid search parameter");
  } else {
    next();
  }
}

const searchMethodMW = (req, res, next) => {
  const { method } = req.query;

  if (!method) {
    next();
  }

  console.log("we have method content of: ", method);

  if (method === "remove") {
    // trigger search controller method for remove
    searchController.removeFilter(req, res);
  }
}

const fetchResMW = (req, res, next) => {
  searchController.addFilter(req, res);
}

const errHandler = (err, req, res, next) => {
  console.log(err);
  res.status(404).render(
    "404", {
    err: err
  });
}

//
// ALL ABOVE ARE MIDDLEWARE FNS 
//

carRouter.get("/", (req, res) => {
  searchController.getAll(req, res, "cars");
});

// route for searching
carRouter.get(
  "/search/:category",
  searchValidator,
  searchMethodMW,
  fetchResMW,
  errHandler
);
// separate path for the search bar queries because 


module.exports = carRouter;



