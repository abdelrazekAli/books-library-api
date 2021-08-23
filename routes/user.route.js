const router = require("express").Router();
const userController = require("../controllers/user.controller");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/users", auth, userController.getUsersList);
router.get("/users/me", auth, userController.getMe);
router.post("/users/save", userController.insertUser);
router.post("/users/auth", userController.userAuth);
router.put("/users/update", [auth, admin], userController.updateUser);
router.put("/users/me/update", auth, userController.updateMe);

module.exports = router;
