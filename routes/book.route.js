const router = require("express").Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// Import book controllers
const {
  getBooksList,
  getBookDetails,
  getBooksByCategory,
  insertBook,
  updateBook,
  deleteBookById,
  deleteBooksBystoreCode,
} = require("../controllers/book.controller");

// Book routers
router.get("/", auth, getBooksList);
router.get("/id/:bookId", auth, getBookDetails);
router.get("/category/:booksCategory", auth, getBooksByCategory);
router.post("/", [auth, admin], insertBook);
router.put("/", [auth, admin], updateBook);
router.delete("/id/:bookId", [auth, admin], deleteBookById);
router.delete("/storecode/:storeCode", [auth, admin], deleteBooksBystoreCode);

module.exports = router;
