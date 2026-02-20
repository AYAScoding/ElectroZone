const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Explicitly map each auth route
app.post('/auth/register', createProxyMiddleware({
  target: 'http://localhost:5001',
  changeOrigin: true,
  pathRewrite: { '^/auth/register': '/api/users/register' }
}));

app.post('/auth/login', createProxyMiddleware({
  target: 'http://localhost:5001',
  changeOrigin: true,
  pathRewrite: { '^/auth/login': '/api/users/login' }
}));

app.get('/auth/profile', createProxyMiddleware({
  target: 'http://localhost:5001',
  changeOrigin: true,
  pathRewrite: { '^/auth/profile': '/api/users/profile' }
}));

app.patch('/auth/preferences', createProxyMiddleware({
  target: 'http://localhost:5001',
  changeOrigin: true,
  pathRewrite: { '^/auth/preferences': '/api/users/preferences' }
}));

// Catch-all: return JSON 404 (never HTML)
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found in Gateway' });
});

module.exports = app;