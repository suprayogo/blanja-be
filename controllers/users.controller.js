const db = require("../connection");
const model = require("../models/users.models");

async function getUsers(req, res) {
  try {
    const data = await db`SELECT * FROM users`;
    console.log(data);

    res.send({
      status: true,
      message: "Success get data",
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
}

module.exports = {
  getUsers,
};
