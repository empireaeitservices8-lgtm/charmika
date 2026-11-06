const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const routes = require("./routes");
const { errorHandler, notFoundHandler } = require("./middleware/error.middleware");

const app = express();

// Middlewares
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || origin.startsWith("http://localhost:")) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static folder for uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "CHARMIKA backend server is healthy and operational",
    timestamp: new Date().toISOString(),
  });
});

// Admin API Routes
app.use("/api/admin", routes);

// Centralized error handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
