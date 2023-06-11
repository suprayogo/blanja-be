const router = require("express").Router();
const reviewController = require("../controllers/review.controller");
const middleware = require("../middleware/jwt.middleware");

router.get("/review", reviewController.getProductReview);

module.exports = router;
