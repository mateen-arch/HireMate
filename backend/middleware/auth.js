import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Access denied. No token provided.",
      success: false,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "demo_secret_key");
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({
      message: "Invalid or expired token",
      success: false,
    });
  }
};

