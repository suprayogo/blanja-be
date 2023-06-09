const router = require("express").Router();
const productController = require("../controllers/product.controller");

// get all data
router.get("/product", productController.getProduct);

module.exports = router;
