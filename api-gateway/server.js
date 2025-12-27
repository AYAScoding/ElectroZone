// server.js
const express = require('express');
const { createReadStream } = require('fs');
const app = express();

// Parse JSON body (safe here because we control the route)
app.use(express.json());

// Manual proxy for register
app.post('/auth/register', async (req, res) => {
  try {
const response = await fetch('http://user-service:5001/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Gateway error' });
  }
});

// Add other routes as needed (login, profile, etc.)

app.listen(3000, () => {
  console.log('✅ Simple Gateway running on http://localhost:3000');
});