const router = require("express").Router();

const authController = require("../controllers/auth.controller");

router.post("/auth/login", authController.loginUser);

module.exports = router;
