const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  console.log("🔧 Setting up proxy middleware...");

  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:3002",
      changeOrigin: true,
      secure: false,
      logLevel: "debug",
      onError: (err, req, res) => {
        console.error("❌ Proxy error:", err.message);
        console.error("❌ Request URL:", req.url);
        console.error("❌ Target:", "http://localhost:3002");
        if (!res.headersSent) {
          res.status(500).json({
            error: "Proxy error",
            details: err.message,
            target: "http://localhost:3002" + req.url,
          });
        }
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log(
          `🔄 Proxying ${req.method} ${req.url} -> http://localhost:3002${req.url}`
        );
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log(`✅ Proxy response: ${proxyRes.statusCode} for ${req.url}`);
      },
    })
  );

  app.use(
    "/socket.io",
    createProxyMiddleware({
      target: "http://localhost:3002",
      ws: true,
      changeOrigin: true,
      secure: false,
      logLevel: "debug",
    })
  );

  console.log("✅ Proxy middleware setup complete!");
};
