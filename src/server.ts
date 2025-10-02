import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { json, urlencoded } from "body-parser";
import { config } from "dotenv";
import { createServer } from "http";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import router from "./routes/routes";

config();

const app = express();

// ---- Middleware ----
app.use(cors({ origin: true, credentials: true }));
app.use(json());
app.use(urlencoded({ extended: true }));

// Trust proxy for secure cookies when behind reverse proxy (Traefik/Nginx)
app.set("trust proxy", 1);

// ---- Rate Limiting ----
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  keyGenerator: (req, res) => ipKeyGenerator(req.ip as any),
  handler: (req: Request, res: Response) => {
    console.log(`⚠️ Rate limit exceeded for IP/User: ${req.ip}`);
    res.status(429).json({
      status: 429,
      error: "Too many requests, please try again later.",
    });
  },
});

app.use(apiLimiter);

app.use("/api", router)


const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    const server = createServer(app);

    server.listen(PORT, () => {
      if (process.env.NODE_ENV === "production") {
        console.log(`🚀 Gateway running on production mode`);
      } else {
        console.log(`🚀 Gateway running at http://localhost:${PORT}`);
      }
    });
  } catch (err) {
    console.error("❌ Failed to start gateway:", err);
    process.exit(1);
  }
};

startServer();
