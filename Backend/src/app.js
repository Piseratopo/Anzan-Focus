const express = require('express');
const cors = require('cors');

// Route modules
const healthRouter = require('./routes/health');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const sessionsRouter = require('./routes/sessions');
const questionsRouter = require('./routes/questions');

/**
 * Creates and configures the Express application.
 * Separated from server startup so the app can be tested independently.
 */
function createApp() {
  const app = express();

  // ── Global middleware ──────────────────────────────────────────────

  // CORS — allow requests from the Nuxt frontend dev server and production origin
  app.use(
    cors({
      origin: [
        'http://localhost:3000', // Nuxt dev server
        process.env.FRONTEND_ORIGIN ?? '',
      ].filter(Boolean),
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  );

  // Parse JSON request bodies
  app.use(express.json());

  // ── Routes ────────────────────────────────────────────────────────

  app.use('/api/auth', authRouter);
  app.use('/api/health', healthRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/sessions', sessionsRouter);
  app.use('/api/questions', questionsRouter);

  // ── 404 handler ───────────────────────────────────────────────────

  app.use((req, res) => {
    res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
  });

  // ── Global error handler ──────────────────────────────────────────

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error('[Error]', err);
    const status = err.status ?? err.statusCode ?? 500;
    res.status(status).json({
      error: err.message ?? 'Internal server error.',
    });
  });

  return app;
}

module.exports = { createApp };

