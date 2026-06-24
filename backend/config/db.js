const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  port: 5432,
  database: "oviu_db",
  password: "12345",
});

module.exports = pool;
