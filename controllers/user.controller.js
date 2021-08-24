const queries = require("../db/queries");
const dbConnection = require("../db/connection");
const jwt = require("jsonwebtoken");
const logger = require("../config/logger");
const bcrypt = require("bcrypt");
const imgUpload = require("../util/imgUpload");
const { generateToken } = require("../util/utility");
const {
  userValidation,
  authValidation,
  checkUsername,
  checkEmail,
  getUserById,
  getUserByEmail,
} = require("../models/user.model");

exports.getMe = async (req, res) => {
  try {
    let user = await getUserById(req.user.userId);
    return res.status(200).send(JSON.stringify(user));
  } catch (err) {
    logger.error(`From user.controller on getMe : ${err}`);
    return res.status(500).send({ error: "Faild to get me" });
  }
};

exports.getUsersList = async (req, res) => {
  try {
    let getUsersListQuery = queries.queryList.getUsersListQuery;
    let result = await dbConnection.dbQuery(getUsersListQuery);
    return res.status(200).send(JSON.stringify(result.rows));
  } catch (err) {
    logger.error(`From user.controller on getUsersList : ${err}`);
    return res.status(500).send({ error: "Faild to get users list" });
  }
};

exports.insertUser = async (req, res) => {
  try {
    let { username, email, password, fullName, age } = req.body;
    if (!password) {
      return res.status(400).send("Password is required");
    }
    let validationError = await userValidation(req.body);
    if (validationError) {
      return res.status(400).send(validationError.details[0].message);
    }

    let checkUsernameResult = await checkUsername(username);
    if (checkUsernameResult) {
      return res.status(400).send(`username : ${username} is already use`);
    }

    let checkEmailResult = await checkEmail(email);
    if (checkEmailResult) {
      return res.status(400).send(`email : ${email} is already use`);
    }

    let hashedPassword = await bcrypt.hash(password, 10);

    let isAdmin = "false";
    let values = [username, email, hashedPassword, fullName, age, isAdmin];

    let insertUserQuery = queries.queryList.insertUserQuery;
    let result = await dbConnection.dbQuery(insertUserQuery, values);
    let user = result.rows[0];

    let jwtPayload = { userId: user.user_id, isAdmin: user.isAdmin };
    let token = generateToken(jwtPayload);
    res.setHeader("x-auth-token", token);

    return res.status(200).send("user created successfully");
  } catch (err) {
    logger.error(`From user.controller on insertUser : ${err}`);
    return res.status(500).send({ error: "Faild to insert new user" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    let { userId, username, email, fullName, age } = req.body;
    if (!userId) return res.status(400).send("UserId is required");

    let user = await getUserById(userId);
    if (!user) return res.status(404).send(`User ID : ${userId} not found`);

    let validationError = await userValidation(req.body);
    if (validationError) {
      return res.status(400).send(validationError.details[0].message);
    }

    let checkUsernameResult = await checkUsername(username);
    if (checkUsernameResult && username != user.username) {
      return res.status(400).send(`username : ${username} is already use`);
    }

    let checkEmailResult = await checkEmail(email);
    if (checkEmailResult && email != user.email) {
      return res.status(400).send(`email : ${email} is already use`);
    }

    let userImg = user.user_img;
    if (req.files) {
      let image = req.files.userImg;
      let checkImgFromat = await imgUpload.checkImgFromat(image);
      if (!checkImgFromat) {
        return res
          .status(400)
          .send(
            "Invalid image format. Only 'jpg' and 'jpeg' and 'png' images are allowed and its name must be less than 30 characters"
          );
      }

      //upload img
      let imgName = await imgUpload.uploadUserImg(image);
      if (!imgName) return res.status(500).send("Faild to upload image");

      //remove Old image
      let oldImg = user.user_img;
      imgUpload.removeOldImg(oldImg);

      userImg = `uploads/user.imgs/${imgName}`;
    }
    let values = [username, email, fullName, userImg, age, userId];

    let updateUserQuery = queries.queryList.updateUserQuery;
    await dbConnection.dbQuery(updateUserQuery, values);
    return res.status(200).send("User updated successfully");
  } catch (err) {
    console.log(err);
    logger.error(`From user.controller on updateUser : ${err}`);
    return res.status(500).send({ error: "Faild to update user" });
  }
};

exports.updateMe = async (req, res) => {
  try {
    let userId = req.user.userId;
    let { username, email, fullName, age } = req.body;
    if (!userId) return res.status(400).send("You are not user");

    let user = await getUserById(userId);

    let validationError = await userValidation(req.body);
    if (validationError) {
      return res.status(400).send(validationError.details[0].message);
    }

    let checkUsernameResult = await checkUsername(username);
    if (checkUsernameResult && username != user.username) {
      return res.status(400).send(`username : ${username} is already use`);
    }

    let checkEmailResult = await checkEmail(email);
    if (checkEmailResult && email != user.email) {
      return res.status(400).send(`email : ${email} is already use`);
    }

    let userImg = user.user_img;
    if (req.files) {
      let image = req.files.userImg;
      let checkImgFromat = await imgUpload.checkImgFromat(image);
      if (!checkImgFromat) {
        return res
          .status(400)
          .send(
            "Invalid image format. Only 'jpg' and 'jpeg' and 'png' images are allowed and name must be less than 30 characters"
          );
      }

      //upload img
      let imgName = await imgUpload.uploadUserImg(image);
      if (!imgName) return res.status(500).send("Faild to upload image");

      //remove Old image
      let oldImg = user.user_img;
      imgUpload.removeOldImg(oldImg);

      userImg = `uploads/user.imgs/${imgName}`;
    }

    let values = [username, email, fullName, userImg, age, userId];

    let updateUserQuery = queries.queryList.updateUserQuery;
    await dbConnection.dbQuery(updateUserQuery, values);
    return res.status(200).send("User updated successfully");
  } catch (err) {
    console.log(err);
    logger.error(`From user.controller on updateMe : ${err}`);
    return res.status(500).send({ error: "Faild to update your details" });
  }
};

exports.userAuth = async (req, res) => {
  let { email, password } = req.body;

  let validationError = await authValidation(req.body);
  if (validationError) {
    return res.status(400).send(validationError.details[0].message);
  }

  let user = await getUserByEmail(email);
  if (!user) return res.status(400).send(`Invalid email or password`);

  let passwordCheck = await bcrypt.compare(password, user.password);
  if (!passwordCheck) return res.status(400).send(`Invalid email or password`);

  let jwtPayload = { userId: user.user_id, isAdmin: user.is_admin };
  let token = generateToken(jwtPayload);

  return res.status(200).send(token);
};
