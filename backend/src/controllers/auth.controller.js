const bcrypt = require("bcryptjs");
const prisma = require("../config/db");
const { generateToken, setAuthCookie, clearAuthCookie } = require("../utils/token");

/**
 * POST /api/admin/auth/login
 * Authenticates admin credentials, returns admin profile, sets secure HTTP-only cookie.
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const admin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your administrator account has been deactivated.",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = generateToken({
      id: admin.id,
      email: admin.email,
      role: admin.role,
    });

    setAuthCookie(res, token);

    return res.json({
      success: true,
      message: "Sign in successful.",
      data: {
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
        token, // Included for authorization headers if needed
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/admin/auth/logout
 * Clears the HTTP-only cookie session.
 */
async function logout(req, res) {
  clearAuthCookie(res);
  return res.json({
    success: true,
    message: "Logged out successfully.",
  });
}

/**
 * GET /api/admin/auth/me
 * Retrieves current authenticated admin details.
 */
async function getMe(req, res) {
  return res.json({
    success: true,
    message: "Current profile retrieved.",
    data: req.admin,
  });
}

/**
 * PUT /api/admin/auth/profile
 * Updates administrator name and email.
 */
async function updateProfile(req, res, next) {
  try {
    const { name, email } = req.body;
    const cleanEmail = email.toLowerCase().trim();

    // Check if another admin already uses this email
    const existing = await prisma.admin.findFirst({
      where: {
        email: cleanEmail,
        id: { not: req.admin.id },
      },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "The requested email address is already in use by another account.",
      });
    }

    const updated = await prisma.admin.update({
      where: { id: req.admin.id },
      data: {
        name,
        email: cleanEmail,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    });

    return res.json({
      success: true,
      message: "Profile details updated successfully.",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/admin/auth/change-password
 * Updates administrator password after verifying the existing password.
 */
async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;

    const admin = await prisma.admin.findUnique({
      where: { id: req.admin.id },
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Administrator record not found.",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "The current password you provided is incorrect.",
      });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.admin.update({
      where: { id: req.admin.id },
      data: { passwordHash },
    });

    return res.json({
      success: true,
      message: "Password has been updated successfully.",
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
};

