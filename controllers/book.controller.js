const queries = require("../db/queries");
const dbConnection = require("../db/connection");
const logger = require("../config/logger");
const imgUpload = require("../util/imgUpload");
const { bookValidation, checkCode, checkId } = require("../models/book.model");

exports.getBooksList = async (req, res) => {
  try {
    let booksListQuery = queries.queryList.getBooksListQuery;
    let result = await dbConnection.dbQuery(booksListQuery);
    return res.status(200).send(JSON.stringify(result.rows));
  } catch (err) {
    logger.error(`From book.controller on getBookDetails : ${err}`);
    return res.status(500).send({ error: "Faild to get Books list" });
  }
};

exports.getBookDetails = async (req, res) => {
  try {
    let bookId = req.params.bookId;
    let getBookDetailsQuery = queries.queryList.getBookDetailsQuery;
    let result = await dbConnection.dbQuery(getBookDetailsQuery, [bookId]);
    if (result.rowCount == 0) {
      return res.status(404).send({ error: `Book id: ${bookId} not found` });
    }
    return res.status(200).send(JSON.stringify(result.rows));
  } catch (err) {
    logger.error(`From book.controller on getBookDetails : ${err}`);
    return res.status(500).send({ error: "Faild to get book details" });
  }
};

exports.getBooksByCategory = async (req, res) => {
  try {
    let booksCategory = req.params.booksCategory;
    let getBooksByCategoryQuery = queries.queryList.getBooksByCategoryQuery;
    let result = await dbConnection.dbQuery(getBooksByCategoryQuery, [
      booksCategory,
    ]);
    if (result.rowCount == 0) {
      return res
        .status(404)
        .send({ error: `Books category: ${booksCategory} not found` });
    }
    return res.status(200).send(JSON.stringify(result.rows));
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

    let validationError = await bookValidation(req.body);
    if (validationError) {
      return res.status(400).send(validationError.details[0].message);
    }

    let checkCodeResult = await checkCode(storeCode);
    if (!checkCodeResult) {
      return res.status(404).send({ error: "Store code not found" });
    }

    //check if image file exist
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("Book image is required");
    }

    let image = req.files.bookImg;
    let checkImgFromat = await imgUpload.checkImgFromat(image);
    if (!checkImgFromat) {
      return res
        .status(400)
        .send(
          "Invalid image format. Only 'jpg' and 'jpeg' and 'png' images are allowed and its name must be less than 30 characters"
        );
    }

    //upload img
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
    let insertBookQuery = queries.queryList.insertBookQuery;
    await dbConnection.dbQuery(insertBookQuery, values);
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

    let validationError = await bookValidation(req.body);
    if (validationError) {
      return res.status(400).send(validationError.details[0].message);
    }

    if (!createdBy || !bookId) {
      return res
        .status(400)
        .send({ error: "bookId and createdBy is required" });
    }

    let getBookDetailsQuery = queries.queryList.getBookDetailsQuery;
    let result1 = await dbConnection.dbQuery(getBookDetailsQuery, [bookId]);
    if (result1.rowCount == 0) {
      return res.status(404).send({ error: `Book id: ${bookId} not found` });
    }

    let checkCodeResult = await checkCode(storeCode);
    if (!checkCodeResult) {
      return res.status(404).send({ error: "Store code not found" });
    }

    let bookImg = result1.rows[0].book_img;

    //check if image file exist
    if (req.files) {
      //check image extension and name length
      let image = req.files.bookImg;
      let checkImgFromat = await imgUpload.checkImgFromat(image);
      if (!checkImgFromat) {
        return res
          .status(400)
          .send(
            "Invalid image format. Only 'jpg' and 'jpeg' and 'png' images are allowed and its name must be less than 30 characters"
          );
      }

      //upload img
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
    let updateBookQuery = queries.queryList.updateBookQuery;
    await dbConnection.dbQuery(updateBookQuery, values);
    return res.status(200).send(`Book ${bookTitle} updated successfully`);
  } catch (err) {
    logger.error(`From book.controller on updateBook : ${err}`);
    return res.status(500).send({ error: "Faild to update book" });
  }
};

exports.deleteBookById = async (req, res) => {
  try {
    let bookId = req.params.bookId;

    let checkIdResult = await checkId(bookId);
    if (!checkIdResult) {
      return res.status(404).send({ error: `Book id: ${bookId} not found` });
    }

    let deleteBookQuery = queries.queryList.deleteBookByIdQuery;
    await dbConnection.dbQuery(deleteBookQuery, [bookId]);
    return res.status(200).send(`Book with Id: ${bookId} deleted successfully`);
  } catch (err) {
    logger.error(`From book.controller on deleteBook : ${err}`);
    return res.status(500).send({ error: "Faild to delete book" });
  }
};

exports.deleteBooksBystoreCode = async (req, res) => {
  try {
    let storeCode = req.params.storeCode.toUpperCase();

    let checkCodeResult = await checkCode(storeCode);
    if (!checkCodeResult) {
      return res.status(404).send({ error: "Store code not found" });
    }

    let deleteBookByStoreCode = queries.queryList.deleteBooksByStoreCodeQuery;
    await dbConnection.dbQuery(deleteBookByStoreCode, [storeCode]);
    return res
      .status(200)
      .send(`Books with store code: ${storeCode} deleted successfully`);
  } catch (err) {
    logger.error(`From book.controller on deleteBooksBystoreCode : ${err}`);
    return res.status(500).send({ error: "Faild to delete books" });
  }
};
