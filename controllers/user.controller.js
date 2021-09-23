const bcrypt = require("bcrypt");
const logger = require("../config/logger");
const imgUpload = require("../util/imgUpload");
const { dbQuery } = require("../db/connection");
const queries = require("../db/queries").queryList;
const { generateToken } = require("../util/utility");

// Import user model functions
const {
  userValidation,
  authValidation,
  checkUsername,
  checkEmail,
  getUserById,
  getUserByEmail,
} = require("../models/user.model");

exports.getUsersList = async (req, res) => {
  try {
    let { getUsersListQuery } = queries;
    let result = await dbQuery(getUsersListQuery);
    return res.status(200).json(result.rows);
  } catch (err) {
    logger.error(`From user.controller on getUsersList : ${err}`);
    return res.status(500).send({ error: "Faild to get users list" });
  }
};

exports.getMe = async (req, res) => {
  try {
    let user = await getUserById(req.user.userId);
    return res.status(200).json(user);
  } catch (err) {
    logger.error(`From user.controller on getMe : ${err}`);
    return res.status(500).send({ error: "Faild to get me" });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    let { userId } = req.params;
    let user = await getUserById(userId);
    if (!user) return res.status(404).send(`User ID : ${userId} not found`);
    return res.status(200).json(user);
  } catch (err) {
    logger.error(`From user.controller on getUserById : ${err}`);
    return res.status(500).send({ error: "Faild to get user" });
  }
};

exports.insertUser = async (req, res) => {
  try {
    let { username, email, password, fullName, age } = req.body;

    // Check password
    if (!password) {
      return res.status(400).send("Password is required");
    }

    // Check validation errors
    let validationError = await userValidation(req.body);
    if (validationError) {
      return res.status(400).send(validationError.details[0].message);
    }

    // Check username
    let checkUsernameResult = await checkUsername(username);
    if (checkUsernameResult) {
      return res.status(400).send(`username : ${username} is already use`);
    }

    // Check email
    let checkEmailResult = await checkEmail(email);
    if (checkEmailResult) {
      return res.status(400).send(`email : ${email} is already use`);
    }

    // Hash password
    let hashedPassword = await bcrypt.hash(password, 10);

    let isAdmin = "false";
    let values = [username, email, hashedPassword, fullName, age, isAdmin];

    // Insert user
    let { insertUserQuery } = queries;
    let result = await dbQuery(insertUserQuery, values);
    let user = result.rows[0];

    // Set token to headers
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

    // Check user
    let user = await getUserById(userId);
    if (!userId) return res.status(400).send("UserId is required");
    if (!user) return res.status(404).send(`User ID : ${userId} not found`);

    // Check validation errors
    let validationError = await userValidation(req.body);
    if (validationError) {
      return res.status(400).send(validationError.details[0].message);
    }

    // Check username
    let checkUsernameResult = await checkUsername(username);
    if (checkUsernameResult && username != user.username) {
      return res.status(400).send(`username : ${username} is already use`);
    }

    // Check email
    let checkEmailResult = await checkEmail(email);
    if (checkEmailResult && email != user.email) {
      return res.status(400).send(`email : ${email} is already use`);
    }

    // Check if image in req to update
    let userImg = user.user_img;
    if (req.files) {
      let image = req.files.userImg;
      let checkImgFromat = await imgUpload.checkImgFromat(image);
      if (!checkImgFromat) {
        return res.status(400).send("Invalid image format.");
      }

      //upload img
      let imgName = await imgUpload.uploadUserImg(image);
      if (!imgName) return res.status(500).send("Faild to upload image");

      //remove Old image
      let oldImg = user.user_img;
      imgUpload.removeOldImg(oldImg);

      userImg = `uploads/user.imgs/${imgName}`;
    }

    // Update user
    let values = [username, email, fullName, userImg, age, userId];
    let updateUserQuery = queries.updateUserQuery;
    await dbQuery(updateUserQuery, values);
    return res.status(200).send("User updated successfully");
  } catch (err) {
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

    let updateUserQuery = queries.updateUserQuery;
    await dbQuery(updateUserQuery, values);
    return res.status(200).send("User updated successfully");
  } catch (err) {
    logger.error(`From user.controller on updateMe : ${err}`);
    return res.status(500).send({ error: "Faild to update your details" });
  }
};

exports.userAuth = async (req, res) => {
  try {
    let { email, password } = req.body;

    // Check validation errors
    let validationError = await authValidation(req.body);
    if (validationError) {
      return res.status(400).send(validationError.details[0].message);
    }

    // Check email
    let user = await getUserByEmail(email);
    if (!user) return res.status(400).send(`Invalid email or password`);

    // Check password
    let passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck)
      return res.status(400).send(`Invalid email or password`);

    // Login with token
    let jwtPayload = { userId: user.user_id, isAdmin: user.is_admin };
    let token = generateToken(jwtPayload);
    return res.status(200).send({ token: token });
  } catch (err) {
    logger.error(`From user.controller on userAuth : ${err}`);
    return res.status(500).send({ error: "Faild to login" });
  }
};
