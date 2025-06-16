const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  console.log("verifyToken middleware called for route:", req.path);
  const authHeader = req.headers.authorization;
  console.log("Authorization Header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("No token provided");
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Token:", token);

  const JWT_SECRET = process.env.JWT_SECRET;
  console.log("JWT_SECRET:", JWT_SECRET);

  if (!JWT_SECRET) {
    console.log("JWT_SECRET is not defined");
    return res.status(500).json({ message: "Server configuration error: JWT_SECRET not set" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Decoded Token:", decoded);
    req.user = decoded;
    console.log("req.user set to:", req.user);
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return res.status(403).json({ message: "Invalid token", error: error.message });
  }
};

module.exports = verifyToken;