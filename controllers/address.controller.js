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

async function getAddressJwt(req, res) {
  try {
    const token = getToken(req);
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    const id = decoded.user_id;

    const data = await db`SELECT * FROM address WHERE user_id = ${id}`;
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

async function insertAddress(req, res) {
  try {
    const { user_id } = req.user;

    const {
      address_name,
      recipient_name,
      recipient_phone_number,
      address_data,
      postal_code,
      city,
    } = req.body;

    // validasi input
    if (
      !(
        address_name &&
        recipient_name &&
        recipient_phone_number &&
        address_data &&
        postal_code &&
        city
      )
    ) {
      res.status(400).json({
        status: false,
        message: "Bad input, please complete all of fields",
      });
      return;
    }

    const payload = {
      address_name,
      recipient_name,
      recipient_phone_number,
      address_data,
      postal_code,
      city,
      user_id: user_id,
    };

    data = await db`INSERT INTO address ${db(
      payload,
      "address_name",
      "recipient_name",
      "recipient_phone_number",
      "address_data",
      "postal_code",
      "city",
      "user_id"
    )} returning *`;

    res.json({
      status: true,
      message: "Success insert data",
      // data: query,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
}

async function editAddress(req, res) {
  try {
    const { id } = req.user;
    const {
      address_name,
      recipient_name,
      phone_number,
      address_data,
      postal_code,
      city,
    } = req.body;

    const checkAddress =
      await db`SELECT * FROM address WHERE address.user_id = ${id}`;

    if (!checkAddress.length) {
      res.status(404).json({
        status: false,
        message: "data not found, please insert adress data",
      });
      return;
    }

    const payload = {
      address_name: address_name ?? checkAddress[0].address_name,
      recipient_name: recipient_name ?? checkAddress[0].recipient_name,
      phone_number: phone_number ?? checkAddress[0].phone_number,
      address_data: address_data ?? checkAddress[0].address_data,
      postal_code: postal_code ?? checkAddress[0].postal_code,
      city: city ?? checkAddress[0].city,
    };

    data = await db`UPDATE address SET ${db(
      payload,
      "address_name",
      "recipient_name",
      "phone_number",
      "address_data",
      "postal_code",
      "city"
    )} WHERE user_id = ${id} returning *`;

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

async function deleteAddress(req, res) {
  try {
    jwt.verify(
      getToken(req),
      process.env.PRIVATE_KEY,
      async function (err, { id }) {
        if (isNaN(id)) {
          res.status(400).json({
            status: false,
            message: "ID must be integer",
          });
          return;
        }
        const checkAddress =
          await db`SELECT * FROM address WHERE address.user_id = ${id}`;

        if (!checkAddress.length) {
          res.status(404).json({
            status: false,
            message: "data not found",
          });

          return;
        }

        const query =
          await db`DELETE FROM address WHERE user_id = ${id} returning *`;

        res.send({
          status: true,
          message: "Success delete data",
          data: query,
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
}
module.exports = {
  getAddressJwt,
  insertAddress,
  editAddress,
  deleteAddress,
};
