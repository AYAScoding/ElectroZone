const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Proxy to user-service (inside Docker network)
const USER_SERVICE_URL = 'http://user-service:5001';

// ---------------- REGISTER ----------------
app.post('/auth/register', async (req, res) => {
  try {
    const response = await fetch(`${USER_SERVICE_URL}/api/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Gateway register error:', err.message);
    res.status(500).json({ error: 'Gateway error' });
  }
});

// ---------------- LOGIN ----------------
app.post('/auth/login', async (req, res) => {
  try {
    const response = await fetch(`${USER_SERVICE_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Gateway login error:', err.message);
    res.status(500).json({ error: 'Gateway error' });
  }
});

// ---------------- GET PROFILE ----------------
app.get('/auth/profile', async (req, res) => {
  try {
    const headers = {};
    if (req.headers.cookie) {
      headers.Cookie = req.headers.cookie; // 🔑 forward cookie
    }

    const response = await fetch(`${USER_SERVICE_URL}/api/users/profile`, {
      method: 'GET',
      headers
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Gateway profile error:', err.message);
    res.status(500).json({ error: 'Gateway error' });
  }
});

// ---------------- UPDATE PROFILE (🔥 THIS WAS MISSING) ----------------
app.put('/auth/profile', async (req, res) => {
  try {
    const headers = {
      'Content-Type': 'application/json'
    };

    // 🔑 VERY IMPORTANT: forward auth cookie
    if (req.headers.cookie) {
      headers.Cookie = req.headers.cookie;
    }

    const response = await fetch(`${USER_SERVICE_URL}/api/users/profile`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(response.status).json(data);

  } catch (err) {
    console.error('Gateway update profile error:', err.message);
    res.status(500).json({ error: 'Gateway error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Gateway running on port ${PORT}`);
});
