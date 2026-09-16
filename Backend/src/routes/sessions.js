const { Router } = require('express');
const { verifyToken } = require('../middleware/auth');
const { db } = require('../config/firebase');
const { FieldValue } = require('firebase-admin/firestore');

const router = Router();

router.use(verifyToken);

/**
 * GET /api/sessions
 * Lists the authenticated user's practice sessions (most recent first, limit 20).
 * Returns sessions with serialized timestamps and embedded questionLogs.
 */
router.get('/', async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit ?? '20', 10), 100);

    let snap;
    try {
      snap = await db
        .collection('users').doc(req.uid)
        .collection('practiceSessions')
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .get();
    } catch (orderErr) {
      // Fallback in case orderBy index is pending
      snap = await db
        .collection('users').doc(req.uid)
        .collection('practiceSessions')
        .limit(limit)
        .get();
    }

    const sessions = snap.docs.map((d) => {
      const data = d.data();
      const timestamp = data.timestamp?.toDate
        ? data.timestamp.toDate().toISOString()
        : data.timestamp ?? null;
      return {
        sessionId: d.id,
        id: d.id,
        ...data,
        timestamp,
      };
    });

    res.json({ success: true, sessions });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/sessions/:sessionId
 * Returns a single session document including its questionLogs.
 */
router.get('/:sessionId', async (req, res, next) => {
  try {
    const doc = await db
      .collection('users').doc(req.uid)
      .collection('practiceSessions').doc(req.params.sessionId)
      .get();

    if (!doc.exists) return res.status(404).json({ error: 'Session not found.' });

    const data = doc.data();
    const timestamp = data.timestamp?.toDate
      ? data.timestamp.toDate().toISOString()
      : data.timestamp ?? null;

    res.json({ success: true, sessionId: doc.id, id: doc.id, ...data, timestamp });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/sessions
 * Creates a new practice session and automatically adds ALL questions to history (savedQuestions).
 *
 * Body: {
 *   session: { totalQuestions, correctCount, incorrectCount, timeUpCount, averageSpeed, operationTags, settings },
 *   questionLogs: [{ expressionStr, displayStr, operands, operators, userAnswer, correctAnswer, status, timeTaken, bookmarked }]
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

    // Prepare enriched question logs with persistent IDs and metadata
    const enrichedLogs = [];

    for (let i = 0; i < questionLogs.length; i++) {
      const log = questionLogs[i];
      const questionRef = db.collection('savedQuestions').doc();
      const isBookmarked = Boolean(log.bookmarked);

      const questionData = {
        id: questionRef.id,
        userId: req.uid,
        uid: req.uid,
        sessionId: sessionRef.id,
        expressionStr: String(log.expressionStr || log.displayStr || ''),
        displayStr: String(log.displayStr || log.expressionStr || ''),
        operands: Array.isArray(log.operands) ? log.operands.map(Number) : [],
        operators: Array.isArray(log.operators) ? log.operators.map(String) : [],
        userAnswer: log.userAnswer !== null && log.userAnswer !== undefined && !isNaN(Number(log.userAnswer))
          ? Number(log.userAnswer)
          : null,
        correctAnswer: Number(log.correctAnswer ?? 0),
        status: ['correct', 'incorrect', 'time_up'].includes(log.status) ? log.status : 'unknown',
        timeTaken: typeof log.timeTaken === 'number' && !isNaN(log.timeTaken) ? Math.max(0, log.timeTaken) : 0,
        questionIndex: i + 1,
        totalQuestions: questionLogs.length,
        bookmarked: isBookmarked,
        settings: log.settingsSnapshot || session.settings || {},
        createdAt: FieldValue.serverTimestamp(),
      };

      // Write to top-level savedQuestions so all questions are in history
      batch.set(questionRef, questionData);

      enrichedLogs.push({
        ...questionData,
        createdAt: new Date().toISOString(),
      });
    }

    // Write session document with embedded questionLogs for instant breakdown retrieval
    batch.set(sessionRef, {
      ...session,
      timestamp: FieldValue.serverTimestamp(),
      questionLogs: enrichedLogs,
    });

    await batch.commit();

    res.status(201).json({
      success: true,
      sessionId: sessionRef.id,
      questionLogs: enrichedLogs,
      message: 'Practice session and all questions recorded to history.',
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/sessions/:sessionId
 * Deletes a practice session and removes associated questions from savedQuestions.
 */
router.delete('/:sessionId', async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const sessionRef = db.collection('users').doc(req.uid).collection('practiceSessions').doc(sessionId);
    const sessionDoc = await sessionRef.get();

    if (!sessionDoc.exists) {
      return res.status(404).json({ error: 'Session not found.' });
    }

    const batch = db.batch();
    batch.delete(sessionRef);

    // Delete associated questions from savedQuestions
    try {
      const qSnap = await db.collection('savedQuestions')
        .where('userId', '==', req.uid)
        .where('sessionId', '==', sessionId)
        .get();

      qSnap.docs.forEach((doc) => batch.delete(doc.ref));
    } catch (qErr) {
      console.warn('Could not query questions by sessionId for deletion:', qErr);
    }

    await batch.commit();

    res.json({ success: true, message: 'Session and its questions removed.', sessionId });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

