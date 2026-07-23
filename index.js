const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");


// ================= CONFIG =================
dotenv.config();

// ================= DB =================
const connectDB = require("./config/db");
connectDB();

// ================= APP =================
const app = express();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// ================= SECURITY MIDDLEWARE =================
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: "Too many requests, try again later.",
});

app.use(limiter);

// ================= BODY PARSER =================
app.use(express.json());
app.use(cookieParser());

// ================= CORS =================
const allowedOrigins = [
  "http://localhost:5173",
  "https://glittering-banoffee-98234c.netlify.app",
  "https://techby.in",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-store-token"],
  })
);

// ================= CRON JOBS =================
require("./corn/productLifecycleCron");

// (optional fallback log cron)
const cron = require("node-cron");
cron.schedule("0 0 * * *", () => {
  console.log("🕒 Daily server cron heartbeat executed");
});

// ================= ROUTES =================
const authRoutes = require("./routes/AuthRoutes");
const jobRoutes = require("./routes/JobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const userRoutes = require("./routes/UserRoutes");
const demoInterviewRoutes = require("./routes/DemoInterviewRoutes");
const paymentRoutes=require("./routes/paymentRoutes");




// API PREFIXES
app.use("/api/payment",paymentRoutes);
app.use("/api/interviews", demoInterviewRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/users", userRoutes);
app.use("/api/applications", applicationRoutes);
// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.send("🚀 Server running successfully");
});

// ================= GLOBAL ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("🔥 Global Error:", err.message);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

const PORT = process.env.PORT || 5000;

// ================= SERVER =================
const server = http.createServer(app);



// ================= START SERVER =================
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});