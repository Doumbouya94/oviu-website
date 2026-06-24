const pool = require("../config/db");

const getProducts = async (req, res) => {

  try {

    const result = await pool.query(
      "SELECT * FROM products ORDER BY id"
    );

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  getProducts
};