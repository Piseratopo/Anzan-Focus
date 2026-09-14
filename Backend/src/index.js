require('dotenv').config();

// Initialize Firebase Admin before anything else
require('./config/firebase');

const { createApp } = require('./app');

const PORT = parseInt(process.env.PORT ?? '3001', 10);

const app = createApp();

app.listen(PORT, () => {
  console.log(`[Server] Anzan Focus API running at http://localhost:${PORT}`);
  console.log(`[Server] Environment: ${process.env.NODE_ENV ?? 'development'}`);
});

