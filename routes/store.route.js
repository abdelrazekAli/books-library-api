const router = require("express").Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// Import store controllers
const {
  getStoresList,
  getStoreDetails,
  getStoreBooks,
  insertStore,
  updateStore,
  deleteStore,
} = require("../controllers/store.controller");

// Book routers
router.get("/", auth, getStoresList);
router.get("/id/:storeId", auth, getStoreDetails);
router.get("/books/:storeId", auth, getStoreBooks);
router.post("/", [auth, admin], insertStore);
router.put("/", [auth, admin], updateStore);
router.delete("/:storeId", [auth, admin], deleteStore);

module.exports = router;
