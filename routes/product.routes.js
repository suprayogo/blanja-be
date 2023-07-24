const router = require("express").Router();
const productController = require("../controllers/product.controller");

const middleware = require("../middleware/jwt.middleware");

// get all data
router.get("/product", productController.getProduct);

router.get("/product/:id", productController.getProductById);

router.get("/category", productController.getCategory);

router.post("/product", middleware, productController.insertProduct);

router.get("/seller/product", middleware, productController.getProductByJwt);

router.patch("/product", middleware, productController.editProduct);

router.delete("/product", middleware, productController.deleteProduct);

module.exports = router;
