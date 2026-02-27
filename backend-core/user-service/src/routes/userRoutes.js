// src/routes/userRoutes.js
const express = require('express');
const {
  register,
  login,
  getProfile,
  updatePreferences,
  getAllUsers,
  updateUserRole
} = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', register);
router.post('/login', login);

// Protected routes (require valid JWT)
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updatePreferences);
router.patch('/preferences', auth, updatePreferences);

// Admin routes
router.get('/', auth, admin, getAllUsers);
router.patch('/:id/role', auth, admin, updateUserRole);

module.exports = router;