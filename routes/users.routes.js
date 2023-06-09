const router = require("express").Router();
const usersController = require("../controllers/users.controller");

const middleware = require("../middleware/jwt.middleware");

router.get("/profile", middleware, usersController.getUsers);

router.get("/profile/", middleware, usersController.getProfileById);

router.post("/profile", usersController.insertUsers);

router.patch("/profile", middleware, usersController.editUsers);

router.delete("/profile", middleware, usersController.deleteUsers);

module.exports = router;
