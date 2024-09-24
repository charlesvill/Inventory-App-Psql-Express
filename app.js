const express = require("express");
const path = require("node:path");
const app = express();

const PORT = process.env.PORT || 3000;

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, ()=> {
  console.log(`listening on port ${PORT}`);
});
