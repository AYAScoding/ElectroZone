// src/routes/authRoutes.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const router = express.Router();

// Proxy /auth/* → User Service /api/users/*
router.use(
  '/auth',
  createProxyMiddleware({
    target: process.env.USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/auth': '/api/users', // e.g., /auth/register → /api/users/register
    },
    logLevel: 'debug', // optional: shows proxy logs in dev
  })
);

module.exports = router;