const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "charmika_secure_admin_jwt_secret_key_2026_dev";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

function setAuthCookie(res, token) {
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("charmika_token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    path: "/",
  });
}

function clearAuthCookie(res) {
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie("charmika_token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });
}

module.exports = {
  generateToken,
  verifyToken,
  setAuthCookie,
  clearAuthCookie,
};

