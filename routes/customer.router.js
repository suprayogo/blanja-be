const router = require("express").Router();

const customersController = require("../controllers/customers.controller");
const middleware = require("../middleware/jwt.middleware");

router.get("/customer", middleware, customersController.getCustomer);

module.exports = router;
