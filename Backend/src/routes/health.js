const { Router } = require('express');

const router = Router();

/**
 * GET /api/health
 * Basic liveness probe — returns server status and UTC timestamp.
 */
router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV ?? 'development',
  });
});

module.exports = router;

