const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  // Check for token
  let token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided");
  try {
    let decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(400).send("Invalid token.");
  }
};

module.exports = auth;
