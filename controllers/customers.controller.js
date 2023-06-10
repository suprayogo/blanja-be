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

async function getOnlyCustomer(req, res) {
  try {
    const token = getToken(req);
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    const id = decoded.id;

    const data = await db`SELECT * FROM customers WHERE user_id = ${id}`;

    res.send({
      status: true,
      message: "Success get data",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
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

async function insertCustomer(req, res) {
  try {
    const { id } = req.user;

    const { gender, birthdate } = req.body;

    if (!(gender && birthdate)) {
      res.status(400).json({
        status: false,
        message: "Bad input, please complete all of fields",
      });
      return;
    }

    const payload = {
      gender,
      birthdate,
      user_id: id,
    };

    data = await db`INSERT INTO customers ${db(
      payload,
      "gender",
      "birthdate",
      "user_id"
    )} returning *`;

    const customerId = data[0].id;
    await db`UPDATE users SET customer_id = ${customerId} WHERE id = ${id}`;
    res.json({
      status: true,
      message: "Success insert data",
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

async function editCustomer(req, res) {
  try {
    const { id } = req.user;
    const { gender, birthdate, full_name } = req.body;

    const checkDataUser =
      await db`SELECT full_name FROM users WHERE users.id = ${id}`;
    const checkDataCustomer =
      await db`SELECT * FROM customers WHERE customers.user_id = ${id}`;

    if (!(checkDataCustomer.length && checkDataUser.length)) {
      res.status(404).json({
        status: false,
        message: "data not found, please insert customer data",
      });
      return;
    }

    const payloadUsers = {
      full_name: full_name ?? checkDataUser[0].full_name,
    };

    const payloadCustomers = {
      gender: gender ?? checkDataCustomer[0].gender,
      birthdate: birthdate ?? checkDataCustomer[0].birthdate,
    };

    if (full_name) {
      data = await db`UPDATE users SET ${db(
        payloadUsers,
        "full_name"
      )} WHERE id = ${id} returning *`;
    }

    if (gender) {
      data = await db`UPDATE customers SET ${db(
        payloadCustomers,
        "gender"
      )} WHERE user_id = ${id} returning *`;
    }

    if (birthdate) {
      data = await db`UPDATE customers SET ${db(
        payloadCustomers,
        "birthdate"
      )} WHERE user_id = ${id} returning *`;
    }

    res.json({
      status: true,
      message: "Success Edit data",
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
  getOnlyCustomer,
  getCustomer,
  insertCustomer,
  editCustomer,
};
