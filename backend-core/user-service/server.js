// server.js
const app = require('./src/app');
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 User Service running on port ${PORT}`);
});