const randomString = require("randomstring");
const jwt = require("jsonwebtoken");

exports.getStoreCode = () => {
  return randomString.generate({
    length: 5,
    charset: "alphabetic",
    capitalization: "uppercase",
  });
};

exports.generateToken = (payload) => {
  let token = jwt.sign(payload, process.env.JWT_PRIVATE_KEY);
  return token;
};
