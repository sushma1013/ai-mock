// ============================================
// app.js - Express Application Setup
// ============================================

import express from "express";
import cors from "cors";

// Import all routes
import routes from "./routes/index.js";

// Import error handlers
import {
  errorHandler,
  notFoundHandler,
} from "./middleware/error.middleware.js";

// ============================================
// Create Express App
// ============================================

const app = express();

// ============================================
// CORS
// ============================================

const allowedOrigins = [
  "http://localhost:5173",
  "https://ai-mock-fend.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked CORS origin:", origin);
      return callback(new Error(`CORS not allowed for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ============================================
// BODY PARSER
// ============================================

app.use(
  express.json({
    limit: "10mb",
  })
);

// ============================================
// HEALTH CHECK
// ============================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI Mock Interview API is running",
    environment: process.env.NODE_ENV || "development",
  });
});

// ============================================
// API ROUTES
// ============================================

// /api/auth
// /api/interview
// /api/resume
// /api/history

app.use("/api", routes);

// ============================================
// ERROR HANDLING
// ============================================

// 404
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// ============================================
// EXPORT
// ============================================

export default app;