const { Router } = require("express");
const testQuery = require("../controllers/searchController.js");
const searchRouter = Router();


searchRouter.use("/", (req, res) => {
  testQuery(req, res);
});


module.exports = searchRouter;



