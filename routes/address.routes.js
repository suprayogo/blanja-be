const router = require("express").Router();
const addressController = require("../controllers/address.controller");
const middleware = require("../middleware/jwt.middleware");

router.get("/address", middleware, addressController.getAddressJwt);

router.post("/customer/address", middleware, addressController.insertAddress);

router.patch(
  "/address/edit_address",
  middleware,
  addressController.editAddress
);

router.delete(
  "/address/delete_address",
  middleware,
  addressController.deleteAddress
);

module.exports = router;
