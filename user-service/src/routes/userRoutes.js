// src/routes/userRoutes.js
const express = require('express');
const {
  register,
  login,
  getProfile,
  updatePreferences
} = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', register);
router.post('/login', login);

// Protected routes (require valid JWT)
router.get('/profile', auth, getProfile);
router.patch('/preferences', auth, updatePreferences);

module.exports = router;