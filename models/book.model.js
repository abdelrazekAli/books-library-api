const Joi = require("joi");
const queries = require("../db/queries").queryList;
const { dbQuery } = require("../db/connection");

exports.Book = class Book {
  constructor(
    id,
    title,
    description,
    author,
    publisher,
    category,
    price,
    image,
    pages,
    createdBy
  ) {
    (this.id = id),
      (this.title = title),
      (this.description = description),
      (this.author = author),
      (this.publisher = publisher),
      (this.category = category),
      (this.price = price),
      (this.image = image),
      (this.pages = pages),
      (this.createdBy = createdBy);
  }
};

// Book validation with joi
exports.bookValidation = async (data) => {
  const schema = Joi.object({
    bookId: Joi.number().integer(),
    bookTitle: Joi.string().min(2).max(50).required(),
    bookDescription: Joi.string().min(4).max(1000).required(),
    bookAuthor: Joi.string().min(2).max(50).required(),
    bookPublisher: Joi.string().min(2).max(50).required(),
    bookCategory: Joi.string().min(2).max(50).required(),
    bookPrice: Joi.number().integer().max(10000).required(),
    bookPages: Joi.number().integer().max(10000),
    createdBy: Joi.string().max(50),
    storeCode: Joi.string().max(5).uppercase().required(),
  });
  return schema.validate(data).error;
};

// Check for book id
exports.checkId = async (id) => {
  let { checkBookIdQuery } = queries;
  let result = await dbQuery(checkBookIdQuery, [id]);
  if (result.rows[0].count == 0) return false;
  return true;
};

// Check for store code
exports.checkCode = async (code) => {
  let { checkStoreCodeQuery } = queries;
  let result = await dbQuery(checkStoreCodeQuery, [code]);
  if (result.rows[0].count == 0) return false;
  return true;
};
