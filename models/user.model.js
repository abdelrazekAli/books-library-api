const Joi = require("joi");
const queries = require("../db/queries").queryList;
const { dbQuery } = require("../db/connection");

exports.User = class User {
  constructor(
    userId,
    username,
    email,
    password,
    fullName,
    userImg,
    age,
    isAdmin
  ) {
    (this.userId = userId),
      (this.username = username),
      (this.email = email),
      (this.password = password),
      (this.fullName = fullName),
      (this.userImg = userImg),
      (this.age = age),
      (this.isAdmin = isAdmin);
  }
};

// User register validation
exports.userValidation = async (data) => {
  const schema = Joi.object({
    userId: Joi.number().integer(),
    username: Joi.string().min(2).max(50).required(),
    email: Joi.string().min(2).max(50).email().lowercase().required(),
    password: Joi.string().min(6).max(60),
    fullName: Joi.string().min(4).max(100).required(),
    age: Joi.number().integer().greater(6).less(100),
    isAdmin: Joi.boolean(),
  });
  return schema.validate(data).error;
};

// User login validation
exports.authValidation = async (data) => {
  const schema = Joi.object({
    email: Joi.string().min(2).max(50).email().lowercase().required(),
    password: Joi.string().min(6).max(60).required(),
  });
  return schema.validate(data).error;
};

// Check username
exports.checkUsername = async (username) => {
  let { checkUsernameQuery } = queries;
  let result = await dbQuery(checkUsernameQuery, [username]);
  if (result.rows[0].count == 0) return false;
  return true;
};

// Check email
exports.checkEmail = async (email) => {
  let { checkEmailQuery } = queries;
  let result = await dbQuery(checkEmailQuery, [email]);
  if (result.rows[0].count == 0) return false;
  return true;
};

// Get user by id
exports.getUserById = async (id) => {
  let { getUserByIdQuery } = queries;
  let result = await dbQuery(getUserByIdQuery, [id]);
  return result.rows[0];
};

// Get user by email
exports.getUserByEmail = async (email) => {
  let { getUserByEmailQuery } = queries;
  let result = await dbQuery(getUserByEmailQuery, [email]);
  return result.rows[0];
};
