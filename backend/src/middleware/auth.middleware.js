const prisma = require("../config/db");
const { verifyToken } = require("../utils/token");

async function authGuard(req, res, next) {
  try {
    // 1. Get token from HTTP-only cookie or Authorization header
    let token = req.cookies?.charmika_token;

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please sign in to access this resource.",
      });
    }

    // 2. Verify token
    const decoded = verifyToken(token);

    // 3. Find active admin in DB
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        message: "User session is invalid or has been deactivated.",
      });
    }

    // 4. Attach admin to request object
    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Session expired or invalid token. Please log in again.",
    });
  }
}

module.exports = {
  authGuard,
};

