const router = require("express").Router();
const storeController = require("../controllers/store.controller");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/stores", auth, storeController.getStoresList);
router.get("/stores/details/:storeId", auth, storeController.getStoreDetails);
router.get("/stores/books/:storeId", auth, storeController.getStoreBooks);
router.post("/stores/save", [auth, admin], storeController.insertStore);
router.put("/stores/update", [auth, admin], storeController.updateStore);
router.delete(
  "/stores/delete/id/:storeId",
  [auth, admin],
  storeController.deleteStore
);

module.exports = router;
