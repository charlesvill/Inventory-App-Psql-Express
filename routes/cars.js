const { Router } = require("express");
const searchController = require("../controllers/searchController.js");
const carController = require("../controllers/carController.js");
const carRouter = Router();

const filterValidator = (req, res, next) => {
  const value = Number(req.params.category.slice(1));
  console.log('value is', value);
  if (isNaN(value)) {
    console.log("there should be an error triggering")
    throw new Error("Invalid search parameter");
  } else {
    next();
  }
}



const removeFilterMW = (req, res, next) => {
  const { method } = req.query;

  if (!method) {
    next();
    return;
  }

  console.log("we have method content of: ", method);

  if (method === "remove") {
    // trigger search controller method for remove
    searchController.removeFilter(req, res);
  }
}

const addFilterMW = (req, res, next) => {
  searchController.addFilter(req, res);
}

const errHandler = (err, req, res, next) => {
  console.log(err);
  res.status(404).render(
    "404", {
    err: err
  });
}

const IDValidator = (req, res, next) => {
  const value = Number(req.params.id.slice(1));
  console.log('value is', value);
  if (isNaN(value)) {
    console.log("there should be an error triggering")
    throw new Error("Invalid search parameter");
  } else {
    next();
  }
}

const editMW = (req,res, next) => {
  carController.editModel(req, res);
}

const publishEditsMW = (req, res, next) => {
  carController.publishEdits(req, res);
}

const profileMW = (req, res, next) => {
  carController.viewProfile(req, res);
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
  filterValidator,
  removeFilterMW,
  addFilterMW,
  errHandler
);


// router for /car/edit/id
// with ID pull the fields pull form, set value to db fields 
// the post will run update statements in the db 
//
// 1. routing
// 2. controller sends id to get db rows
// 3. requests the ejs form and passes the data 

carRouter.get(
  "/edit/:id", 
  IDValidator,
  editMW,
  errHandler
);

// router for post method on /edit/:id
carRouter.post(
  "/edit/:id",
  IDValidator,
  publishEditsMW,
  errHandler
);


// router for /car/profile/id
carRouter.get(
  "/profile/:id",
  IDValidator,
  profileMW,
  errHandler
);

module.exports = carRouter;



