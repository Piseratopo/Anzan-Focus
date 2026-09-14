const { Router } = require('express');
const { verifyToken } = require('../middleware/auth');
const { db } = require('../config/firebase');
const { FieldValue } = require('firebase-admin/firestore');

const router = Router();

router.use(verifyToken);

/**
 * GET /api/sessions
 * Lists the authenticated user's practice sessions (most recent first, limit 20).
 */
router.get('/', async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit ?? '20', 10), 100);

    const snap = await db
      .collection('users').doc(req.uid)
      .collection('practiceSessions')
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();

    const sessions = snap.docs.map((d) => ({ sessionId: d.id, ...d.data() }));
    res.json({ sessions });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/sessions/:sessionId
 * Returns a single session document.
 */
router.get('/:sessionId', async (req, res, next) => {
  try {
    const doc = await db
      .collection('users').doc(req.uid)
      .collection('practiceSessions').doc(req.params.sessionId)
      .get();

    if (!doc.exists) return res.status(404).json({ error: 'Session not found.' });

    res.json({ sessionId: doc.id, ...doc.data() });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/sessions
 * Creates a new practice session and its question logs in a single batch write.
 *
 * Body: {
 *   session: { totalQuestions, correctCount, incorrectCount, timeUpCount, averageSpeed, operationTags },
 *   questionLogs: [{ expressionStr, userAnswer, correctAnswer, status, timeTaken, bookmarked }]
 * }
 */
router.post('/', async (req, res, next) => {
  try {
    const { session, questionLogs = [] } = req.body;

    if (!session) {
      return res.status(400).json({ error: '`session` object is required.' });
    }

    const userRef = db.collection('users').doc(req.uid);
    const sessionRef = userRef.collection('practiceSessions').doc();
    const batch = db.batch();

    // Write session document
    batch.set(sessionRef, {
      ...session,
      timestamp: FieldValue.serverTimestamp(),
    });

    // Write each question log as a sub-document
    for (const log of questionLogs) {
      const logRef = sessionRef.collection('questionLogs').doc();
      batch.set(logRef, {
        ...log,
        bookmarked: log.bookmarked ?? false,
      });
    }

    await batch.commit();

    res.status(201).json({ sessionId: sessionRef.id, message: 'Session saved.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
