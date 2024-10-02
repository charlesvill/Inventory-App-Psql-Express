const { Router } = require('express');
const addController = require('../controllers/addController.js');

const addRouter = Router();

addRouter.get("/", (req, res) => {
  addController.getAddForm(req, res);
});
addRouter.post("/", (req, res) => {
  addController.addCar(req, res);
});



module.exports = addRouter;
