const router = require("express").Router();
const usersController = require("../controllers/users.controller");

const middleware = require("../middleware/jwt.middleware");

router.get("/users", middleware, usersController.getUsers);

router.get("/users", middleware, usersController.getProfileById);

router.post("/register/customer", usersController.registerCustomer);

router.post("/register/seller", usersController.registerSeller);

router.patch("/users", middleware, usersController.editUsers);

router.delete("/users", middleware, usersController.deleteUsers);

router.patch("/users/photo", middleware, usersController.editUsersPhoto);

module.exports = router;
