const { Router } = require("express");

const indexRouter = Router();

indexRouter.use("/", (req, res) => {
  //home page using controller
  res.render("index");
});

module.exports = indexRouter;


