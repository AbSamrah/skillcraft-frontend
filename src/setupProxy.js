const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://localhost:5093", // IMPORTANT: Make sure this port matches your backend's HTTPS port
      changeOrigin: true,
      secure: false, // Allows proxying to a backend with a self-signed SSL certificate
    })
  );
};
