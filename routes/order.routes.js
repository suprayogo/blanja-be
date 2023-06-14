const router = require("express").Router();

const orderController = require("../controllers/order.controller");

const middleware = require("../middleware/jwt.middleware");

router.post("/product/createOrder", middleware, orderController.createOrder);

router.post("/create-payment", middleware, orderController.createPayment);

router.get("/check-status", middleware, orderController.checkStatus);

module.exports = router;
