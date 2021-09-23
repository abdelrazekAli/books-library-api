const router = require("express").Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// Import user controllers
const {
  getUsersList,
  getMe,
  getUserDetails,
  insertUser,
  userAuth,
  updateUser,
  updateMe,
} = require("../controllers/user.controller");

// User routes
router.get("/", auth, getUsersList);
router.get("/me", auth, getMe);
router.get("/id/:userId", auth, getUserDetails);
router.post("/register", insertUser);
router.post("/login", userAuth);
router.put("/", [auth, admin], updateUser);
router.put("/me", auth, updateMe);

module.exports = router;
