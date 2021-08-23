const queries = require("../db/queries");
const dbConnection = require("../db/connection");
const Joi = require("joi");

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

exports.authValidation = async (data) => {
  const schema = Joi.object({
    email: Joi.string().min(2).max(50).email().lowercase().required(),
    password: Joi.string().min(6).max(60).required(),
  });
  return schema.validate(data).error;
};

exports.checkUsername = async (username) => {
  let checkUsernameQuery = queries.queryList.checkUsernameQuery;
  let result = await dbConnection.dbQuery(checkUsernameQuery, [username]);
  if (result.rows[0].count == 0) return false;
  return true;
};

exports.checkEmail = async (email) => {
  let checkEmailQuery = queries.queryList.checkEmailQuery;
  let result = await dbConnection.dbQuery(checkEmailQuery, [email]);
  if (result.rows[0].count == 0) return false;
  return true;
};

exports.getUserById = async (id) => {
  let getUserByIdQuery = queries.queryList.getUserByIdQuery;
  let result = await dbConnection.dbQuery(getUserByIdQuery, [id]);
  return result.rows[0];
};

exports.getUserByEmail = async (email) => {
  let getUserByEmailQuery = queries.queryList.getUserByEmailQuery;
  let result = await dbConnection.dbQuery(getUserByEmailQuery, [email]);
  return result.rows[0];
};
