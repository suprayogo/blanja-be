const router = require("express").Router();
const productController = require("../controllers/product.controller");

const middleware = require("../middleware/jwt.middleware");

const multer = require("multer");
const upload = multer({
  dest: "uploads/",
});

// get all data
router.get("/product", productController.getProduct);

router.get("/newest/product", productController.getNewProduct);

router.get("/popular/product", productController.getPopularProduct);

router.get("/product/:id", productController.getProductById);

router.get("/category", productController.getCategory);

router.post(
  "/product",
  middleware,
  //   upload.array("photo"),
  productController.insertProduct
);

router.get("/seller/product", middleware, productController.getProductByJwt);

router.patch("/product", middleware, productController.editProduct);

router.delete("/product", middleware, productController.deleteProduct);

module.exports = router;
