const logger = require("../config/logger");
const imgUpload = require("../util/imgUpload");
const { dbQuery } = require("../db/connection");
const queries = require("../db/queries").queryList;
const { bookValidation, checkCode, checkId } = require("../models/book.model");

exports.getBooksList = async (req, res) => {
  try {
    let { getBooksListQuery } = queries;
    let result = await dbQuery(getBooksListQuery);
    return res.status(200).json(result.rows);
  } catch (err) {
    logger.error(`From book.controller on getBookDetails : ${err}`);
    return res.status(500).send({ error: "Faild to get Books list" });
  }
};

exports.getBookDetails = async (req, res) => {
  try {
    let { bookId } = req.params;
    let { getBookDetailsQuery } = queries;
    let result = await dbQuery(getBookDetailsQuery, [bookId]);

    // Check if book exist
    if (result.rowCount == 0) {
      return res.status(404).send({ error: `Book id: ${bookId} not found` });
    }
    return res.status(200).json(result.rows);
  } catch (err) {
    logger.error(`From book.controller on getBookDetails : ${err}`);
    return res.status(500).send({ error: "Faild to get book details" });
  }
};

exports.getBooksByCategory = async (req, res) => {
  try {
    let { booksCategory } = req.params;
    let { getBooksByCategoryQuery } = queries;
    let result = await dbQuery(getBooksByCategoryQuery, [booksCategory]);

    // Check if category exist
    if (result.rowCount == 0) {
      return res
        .status(404)
        .send({ error: `Books category: ${booksCategory} not found` });
    }
    return res.status(200).json(result.rows);
  } catch (err) {
    logger.error(`From book.controller on getBooksByCategory : ${err}`);
    return res.status(500).send({ error: "Faild to get books by category" });
  }
};

exports.insertBook = async (req, res) => {
  try {
    let {
      bookTitle,
      bookDescription,
      bookAuthor,
      bookPublisher,
      bookPages,
      bookCategory,
      bookPrice,
      storeCode,
    } = req.body;

    // Check if any validation error
    let validationError = await bookValidation(req.body);
    if (validationError) {
      return res.status(400).send(validationError.details[0].message);
    }

    // Check if store code exist
    let checkCodeResult = await checkCode(storeCode);
    if (!checkCodeResult) {
      return res.status(404).send({ error: "Store code not found" });
    }

    //check if image file exist
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("Book image is required");
    }

    // Check image format
    let image = req.files.bookImg;
    let checkImgFromat = await imgUpload.checkImgFromat(image);
    if (!checkImgFromat) {
      return res.status(400).send("Invalid image format.");
    }

    // Upload image
    let imgName = await imgUpload.uploadBookImg(image);
    if (!imgName) return res.status(500).send("Faild to upload image");

    let createdOn = new Date();
    let createdBy = "admin";
    let bookImg = `uploads/book.imgs/${imgName}`;
    let values = [
      bookTitle,
      bookDescription,
      bookAuthor,
      bookPublisher,
      bookPages,
      bookCategory,
      bookPrice,
      bookImg,
      storeCode,
      createdOn,
      createdBy,
    ];

    // Insert book to database
    let { insertBookQuery } = queries;
    await dbQuery(insertBookQuery, values);
    return res.status(200).send("Book created successfully");
  } catch (err) {
    logger.error(`From book.controller on insertBook : ${err}`);
    return res.status(500).send({ error: "Faild to insert new book" });
  }
};

exports.updateBook = async (req, res) => {
  try {
    let {
      bookTitle,
      bookDescription,
      bookAuthor,
      bookPublisher,
      bookPages,
      bookCategory,
      bookPrice,
      storeCode,
      createdBy,
      bookId,
    } = req.body;

    // Check if any validation error
    let validationError = await bookValidation(req.body);
    if (validationError) {
      return res.status(400).send(validationError.details[0].message);
    }

    // Check if createdBy and bookId exist in req
    if (!createdBy || !bookId) {
      return res
        .status(400)
        .send({ error: "bookId and createdBy is required" });
    }

    // Check if book id exist
    let { getBookDetailsQuery } = queries;
    let result1 = await dbQuery(getBookDetailsQuery, [bookId]);
    if (result1.rowCount == 0) {
      return res.status(404).send({ error: `Book id: ${bookId} not found` });
    }

    // Check if store code exist
    let checkCodeResult = await checkCode(storeCode);
    if (!checkCodeResult) {
      return res.status(404).send({ error: "Store code not found" });
    }

    let bookImg = result1.rows[0].book_img;

    // Check if image file exist
    if (req.files) {
      // Check image extension and name length
      let image = req.files.bookImg;
      let checkImgFromat = await imgUpload.checkImgFromat(image);
      if (!checkImgFromat) {
        return res.status(400).send("Invalid image format.");
      }

      // Upload img
      let imgName = await imgUpload.uploadBookImg(image);
      if (!imgName) return res.status(500).send("Faild to upload image");

      imgUpload.removeOldImg(bookImg); //remove Old image

      bookImg = `uploads/book.imgs/${imgName}`;
    }

    let values = [
      bookTitle,
      bookDescription,
      bookAuthor,
      bookPublisher,
      bookPages,
      bookCategory,
      bookPrice,
      bookImg,
      storeCode,
      createdBy,
      bookId,
    ];

    // Update book
    let { updateBookQuery } = queries;
    await dbQuery(updateBookQuery, values);
    return res.status(200).send(`Book ${bookTitle} updated successfully`);
  } catch (err) {
    logger.error(`From book.controller on updateBook : ${err}`);
    return res.status(500).send({ error: "Faild to update book" });
  }
};

exports.deleteBookById = async (req, res) => {
  try {
    let { bookId } = req.params;

    // Check if book id exist
    let checkIdResult = await checkId(bookId);
    if (!checkIdResult) {
      return res.status(404).send({ error: `Book id: ${bookId} not found` });
    }

    // Delete book
    let deleteBookQuery = queries.deleteBookByIdQuery;
    await dbQuery(deleteBookQuery, [bookId]);
    return res.status(200).send(`Book with Id: ${bookId} deleted successfully`);
  } catch (err) {
    logger.error(`From book.controller on deleteBook : ${err}`);
    return res.status(500).send({ error: "Faild to delete book" });
  }
};

exports.deleteBooksBystoreCode = async (req, res) => {
  try {
    let storeCode = req.params.storeCode.toUpperCase();

    // Check if store code exist
    let checkCodeResult = await checkCode(storeCode);
    if (!checkCodeResult) {
      return res.status(404).send({ error: "Store code not found" });
    }

    // Delete book
    let deleteBookByStoreCode = queries.deleteBooksByStoreCodeQuery;
    await dbQuery(deleteBookByStoreCode, [storeCode]);
    return res
      .status(200)
      .send(`Books with store code: ${storeCode} deleted successfully`);
  } catch (err) {
    logger.error(`From book.controller on deleteBooksBystoreCode : ${err}`);
    return res.status(500).send({ error: "Faild to delete books" });
  }
};
