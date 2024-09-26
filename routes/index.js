const { Router } = require("express");

const indexRouter = Router();

indexRouter.get("/", (req, res) => {
  //home page using controller
  res.render("index");
});

module.exports = indexRouter;


