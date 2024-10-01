const express = require("express");
const path = require("path");
const indexRouter = require("./routes/index.js");
const carRouter = require("./routes/cars.js");
const planeRouter = require("./routes/planes.js");
const addRouter = require("./routes/add.js");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

// Set up view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

// Define routes
app.use("/", indexRouter);
app.use("/cars", carRouter);

//plane one is not completed
app.use("/planes", planeRouter);
app.use("/add", addRouter);

// 404 handler for undefined routes
app.use((req, res, next) => {
  res.status(404).send("404: not found!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

