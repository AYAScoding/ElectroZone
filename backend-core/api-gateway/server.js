const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  credentials: true
}));

app.use(express.json());

// Proxy to user-service
const USER_SERVICE_URL = 'http://127.0.0.1:5001';

/**
 * Helper to proxy requests to User Service
 */
async function proxyToUserService(req, res, path, method = 'GET') {
  try {
    const headers = { ...req.headers };
    // Remove host to avoid conflicts
    delete headers.host;

    // Ensure content-type is set for POST/PATCH/PUT
    if (['POST', 'PATCH', 'PUT'].includes(method)) {
      headers['Content-Type'] = 'application/json';
    }

    const options = {
      method,
      headers
    };

    if (['POST', 'PATCH', 'PUT'].includes(method)) {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(`${USER_SERVICE_URL}${path}`, options);

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return res.status(response.status).json(data);
    } else {
      const text = await response.text();
      return res.status(response.status).send(text);
    }
  } catch (err) {
    console.error(`Gateway proxy error (${method} ${path}):`, err.message);
    res.status(500).json({ error: 'Gateway error', details: err.message });
  }
}

// ---------------- AUTH ROUTES ----------------
app.post('/auth/register', (req, res) => proxyToUserService(req, res, '/api/users/register', 'POST'));
app.post('/auth/login', (req, res) => proxyToUserService(req, res, '/api/users/login', 'POST'));
app.get('/auth/profile', (req, res) => proxyToUserService(req, res, '/api/users/profile', 'GET'));
app.put('/auth/profile', (req, res) => proxyToUserService(req, res, '/api/users/profile', 'PUT'));

// ---------------- USER MANAGEMENT (ADMIN) ----------------
// GET ALL USERS
app.get('/api/users', (req, res) => proxyToUserService(req, res, '/api/users', 'GET'));

// UPDATE USER ROLE
app.patch('/api/users/:id/role', (req, res) => proxyToUserService(req, res, `/api/users/${req.params.id}/role`, 'PATCH'));

// DELETE USER
app.delete('/api/users/:id', (req, res) => proxyToUserService(req, res, `/api/users/${req.params.id}`, 'DELETE'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'API Gateway' });
});

const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Gateway running on port ${PORT}`);
});
