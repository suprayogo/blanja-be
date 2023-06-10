const { query } = require("express");
const db = require("../connection");
const jwt = require("jsonwebtoken");

function getToken(req) {
  const token = req?.headers?.authorization?.slice(
    7,
    req?.headers?.authorization?.length
  );
  return token;
}

async function getCustomer(req, res) {
  try {
    const token = getToken(req);
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    const id = decoded.id;
    console.log(id);

    // data = await db`SELECT * FROM customers WHERE user_id = ${id}`;

    data =
      await db`SELECT users.email, users.full_name, users.phone_number, customers.gender, customers.birthdate 
      FROM users JOIN customers ON users.id = customers.user_id 
      WHERE users.id = ${id};
       `;

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
  getCustomer,
};
