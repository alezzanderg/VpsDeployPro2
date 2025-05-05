import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

// Create Express server
const app = express();

// Configuration
const PORT = 5000;
const API_SERVICE_URL = "http://localhost:8080";

// Proxy middleware
const apiProxy = createProxyMiddleware({
  target: API_SERVICE_URL,
  changeOrigin: true,
  logLevel: 'debug',
});

// Mount the proxy middleware at all paths
app.use('/', apiProxy);

// Start the Proxy server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Proxy server running on port ${PORT}, forwarding to ${API_SERVICE_URL}`);
});