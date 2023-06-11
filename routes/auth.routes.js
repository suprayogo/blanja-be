const router = require("express").Router();

const authController = require("../controllers/auth.controller");

router.post("/customer/login", authController.loginUser);

module.exports = router;
