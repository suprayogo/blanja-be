const db = require("../connection");
const model = require("../models/users.models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function loginCustomer(req, res) {
  await loginUser(req, res, 1); // Pass 1 as the role_id for customers
}
async function loginSeller(req, res) {
  await loginUser(req, res, 2); // Pass 2 as the role_id for sellers
}
async function loginUser(req, res, role_id) {
  try {
    const {
      body: { user_email, user_password },
    } = req;

    if (!(user_email && user_password)) {
      res.status(400).json({
        status: false,
        message: "Email or Password Can't Be EMPTY",
      });
      return;
    }

    const checkEmail =
      await db`SELECT * FROM users WHERE LOWER(user_email) = LOWER(${user_email}) AND roles_id = ${role_id}`;

    if (!checkEmail?.length) {
      res.status(400).json({
        status: false,
        message: "Email not registered ",
      });
      return;
    }

    // Load hash from your password DB.
    bcrypt.compare(
      user_password,
      checkEmail[0]?.user_password,
      function (err, result) {
        if (result) {
          const token = jwt.sign(
            { ...checkEmail[0], user_password: null },
            process.env.PRIVATE_KEY
          );

          res.json({
            status: true,
            message: "Get data success",
            data: checkEmail,
            token,
          });
        } else {
          res.status(400).json({
            status: false,
            message: "Wrong password",
          });
          return;
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: false,
      message: "Error not found",
    });
  }
}

module.exports = {
  loginCustomer,
  loginSeller,
};
