const router = require("express").Router();
const addressController = require("../controllers/address.controller");
const middleware = require("../middleware/jwt.middleware");

router.get("/customer/address", middleware, addressController.getOnlyAddress);

router.post("/customer/address", middleware, addressController.insertAddress);

router.patch("/customer/address", middleware, addressController.editAddress);

router.delete("/customer/address", middleware, addressController.deleteAddress);

module.exports = router;
