var jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // next();
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({
      status: 401,
      message: "Provide authorization token in the header",
    });
  }
  const token = authorization.split(" ")[1];
  if (!token) return res.json({ message: "Invalid token" });
  try {
    var decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded.data;
    next();
  } catch (err) {
    return res.json({ message: "Invalid token" });
  }
};
