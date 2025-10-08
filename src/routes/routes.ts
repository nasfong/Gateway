import { Router } from "express";
import { createProxyMiddleware, Options } from "http-proxy-middleware";

const router = Router();

// Base proxy configuration
const baseProxyConfig: Partial<Options> = {
  changeOrigin: true,
  timeout: 30000, // 30 seconds
  proxyTimeout: 30000,
};

router.use(
  "/ml",
  createProxyMiddleware({
    ...baseProxyConfig,
    target: process.env.ML_SERVICE_URL || "http://localhost:8000",
    pathRewrite: { "^/ml": "" }, // Strips /ml prefix
  })
);

// Auth service proxy - catch-all, should be last
router.use(
  "/",
  createProxyMiddleware({
    ...baseProxyConfig,
    target: process.env.AUTH_SERVICE_URL || "http://localhost:4000",
    // No pathRewrite needed if auth service expects full path
  })
);

export default router;