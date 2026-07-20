const { verifyToken } = require("../utils/generateToken");

// verifies JWT from the httpOnly cookie and attaches decoded payload (id, role) to req.user
const auth = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

const isCandidate = (req, res, next) => {
  if (req.user?.role === "candidate") return next();
  return res.status(403).json({ success: false, message: "Access denied: candidates only" });
};

const isEmployer = (req, res, next) => {
  if (req.user?.role === "employer") return next();
  return res.status(403).json({ success: false, message: "Access denied: employers only" });
};

const isAdmin = (req, res, next) => {
  if (req.user?.role === "admin") return next();
  return res.status(403).json({ success: false, message: "Access denied: admins only" });
};

module.exports = { auth, isCandidate, isEmployer, isAdmin };
