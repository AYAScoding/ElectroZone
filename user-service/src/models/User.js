// src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  name: {
    type: String,
    trim: true,
  },
  preferences: {
    type: Object,
    default: {},
  }
}, {
  timestamps: true
});

// ✅ CORRECT: Hash password before saving (async, no next)
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// ❌ REMOVE THE SECOND (DUPLICATE) HOOK — you only need one!

module.exports = mongoose.model('User', userSchema);