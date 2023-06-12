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

    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(user_email)) {
      res.status(400).json({
        status: false,
        message: "Invalid email format",
      });
      return;
    }
    // Validate password complexity
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(user_password)) {
      res.status(400).json({
        status: false,
        message:
          "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character",
      });
      return;
    }
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
