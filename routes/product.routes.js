const router = require("express").Router();
const productController = require("../controllers/product.controller");

// get all data
router.get("/product", productController.getProduct);

router.get("/product/:id", productController.getProductById);

router.get("/category", productController.getCategory);

module.exports = router;
