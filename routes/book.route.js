const router = require("express").Router();
const bookController = require("../controllers/book.controller");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/books", auth, bookController.getBooksList);
router.get("/books/details/id/:bookId", auth, bookController.getBookDetails);
router.get(
  "/books/details/category/:booksCategory",
  auth,
  bookController.getBooksByCategory
);
router.post("/books/save", [auth, admin], bookController.insertBook);
router.put("/books/update", [auth, admin], bookController.updateBook);
router.delete(
  "/books/delete/id/:bookId",
  [auth, admin],
  bookController.deleteBookById
);
router.delete(
  "/books/delete/storecode/:storeCode",
  [auth, admin],
  bookController.deleteBooksBystoreCode
);

module.exports = router;
