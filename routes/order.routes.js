const router = require("express").Router();

const orderController = require("../controllers/order.controller");

const middleware = require("../middleware/jwt.middleware");

router.post("/product/createOrder", middleware, orderController.createOrder);

module.exports = router;
