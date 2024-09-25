const { Pool } = require("pg");

module.exports = new Pool({
  host: "localhost",
  user: "general-iroh",
  database: "radiodb",
  password: "11788116",
  port: 5432
});
