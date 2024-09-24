const { Router } = require("express");

const searchRouter = Router();

searchRouter.use("/", (req, res) => {

  const results = [{
    name: "placeholder name", 
    description: "this should be working"
  }];
  res.render("search", {
    page: "results",
    content: results
  });
});

module.exports = searchRouter;


