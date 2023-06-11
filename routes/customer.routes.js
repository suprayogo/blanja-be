const router = require("express").Router();
const customersController = require("../controllers/customers.controller");
const middleware = require("../middleware/jwt.middleware");

router.get("/customer", middleware, customersController.getOnlyCustomer);

router.get("/customer/data", middleware, customersController.getCustomer);

router.post("/customer", middleware, customersController.insertCustomer);

router.patch("/customer", middleware, customersController.editCustomer);

module.exports = router;
