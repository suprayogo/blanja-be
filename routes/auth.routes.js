const router = require("express").Router();

const authController = require("../controllers/auth.controller");

router.post("/customer/login", authController.loginCustomer);

router.post("/seller/login", authController.loginSeller);

module.exports = router;
