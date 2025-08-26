const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const JWT_SECRET = process.env.JWT_SECRET;
  const token = req?.cookies?.token;


  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { _id: decoded._id };
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Token is not valid" });
  }
};
