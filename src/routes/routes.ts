import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const router = Router();

router.use(
  "/",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL || "http://localhost:4000",
    changeOrigin: true,
    pathRewrite: { "^/": "" }, // strip /auth prefix
  })
);

export default router;
