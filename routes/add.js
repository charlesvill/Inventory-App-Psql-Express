const { Router } = require('express');
const addController = require('../controllers/addController.js');

const addRouter = Router();

addRouter.get("/", (req, res) => {
  addController(req, res);
});



module.exports = addRouter;
