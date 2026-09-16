const { Router } = require('express');
const { verifyToken } = require('../middleware/auth');
const { db } = require('../config/firebase');
const { FieldValue } = require('firebase-admin/firestore');

const router = Router();

// All question routes require authentication
router.use(verifyToken);

/**
 * Helper to save question play details
 * Saved in top-level 'savedQuestions' collection with 1-to-N relationship to user (userId)
 */
async function saveQuestionPlay(req, res, next) {
   try {
      const {
         expressionStr,
         displayStr,
         operands,
         operators,
         userAnswer,
         correctAnswer,
         status,
         timeTaken,
         questionIndex,
         totalQuestions,
         bookmarked,
         sessionId,
         settings,
      } = req.body;

      if (!expressionStr && (!operands || operands.length === 0)) {
         return res.status(400).json({ error: 'expressionStr or operands are required.' });
      }

      if (correctAnswer === undefined || correctAnswer === null || isNaN(Number(correctAnswer))) {
         return res.status(400).json({ error: 'Valid correctAnswer is required.' });
      }

      const questionData = {
         userId: req.uid,
         uid: req.uid, // 1-N reference to user
         sessionId: sessionId || null,
         expressionStr: String(expressionStr || displayStr || ''),
         displayStr: String(displayStr || expressionStr || ''),
         operands: Array.isArray(operands) ? operands.map(Number) : [],
         operators: Array.isArray(operators) ? operators.map(String) : [],
         userAnswer: userAnswer !== null && userAnswer !== undefined && !isNaN(Number(userAnswer))
            ? Number(userAnswer)
            : null,
         correctAnswer: Number(correctAnswer),
         status: ['correct', 'incorrect', 'time_up'].includes(status) ? status : 'unknown',
         timeTaken: typeof timeTaken === 'number' && !isNaN(timeTaken) ? Math.max(0, timeTaken) : 0,
         questionIndex: typeof questionIndex === 'number' ? questionIndex : null,
         totalQuestions: typeof totalQuestions === 'number' ? totalQuestions : null,
         bookmarked: Boolean(bookmarked),
         settings: typeof settings === 'object' && settings !== null ? settings : {},
         createdAt: FieldValue.serverTimestamp(),
      };

      // Main top-level collection 'savedQuestions'
      const docRef = db.collection('savedQuestions').doc();
      await docRef.set(questionData);

      res.status(201).json({
         success: true,
         id: docRef.id,
         message: 'Question play saved successfully.',
         question: {
            id: docRef.id,
            ...questionData,
            createdAt: new Date().toISOString(),
         },
      });
   } catch (err) {
      next(err);
   }
}

/**
 * POST /api/questions/batch
 * Saves multiple questions in a single Firestore batch write.
 */
router.post('/batch', async (req, res, next) => {
   try {
      const { questions = [], sessionId = null } = req.body;

      if (!Array.isArray(questions) || questions.length === 0) {
         return res.status(400).json({ error: '`questions` array is required.' });
      }

      const batch = db.batch();
      const savedItems = [];

      for (let i = 0; i < questions.length; i++) {
         const q = questions[i];
         const docRef = db.collection('savedQuestions').doc();
         const data = {
            userId: req.uid,
            uid: req.uid,
            sessionId: q.sessionId || sessionId || null,
            expressionStr: String(q.expressionStr || q.displayStr || ''),
            displayStr: String(q.displayStr || q.expressionStr || ''),
            operands: Array.isArray(q.operands) ? q.operands.map(Number) : [],
            operators: Array.isArray(q.operators) ? q.operators.map(String) : [],
            userAnswer: q.userAnswer !== null && q.userAnswer !== undefined && !isNaN(Number(q.userAnswer))
               ? Number(q.userAnswer)
               : null,
            correctAnswer: Number(q.correctAnswer ?? 0),
            status: ['correct', 'incorrect', 'time_up'].includes(q.status) ? q.status : 'unknown',
            timeTaken: typeof q.timeTaken === 'number' && !isNaN(q.timeTaken) ? Math.max(0, q.timeTaken) : 0,
            questionIndex: q.questionIndex ?? i + 1,
            totalQuestions: q.totalQuestions ?? questions.length,
            bookmarked: Boolean(q.bookmarked),
            settings: q.settingsSnapshot || q.settings || {},
            createdAt: FieldValue.serverTimestamp(),
         };

         batch.set(docRef, data);
         savedItems.push({ id: docRef.id, ...data, createdAt: new Date().toISOString() });
      }

      await batch.commit();

      res.status(201).json({
         success: true,
         count: savedItems.length,
         questions: savedItems,
         message: `${savedItems.length} questions saved to history.`,
      });
   } catch (err) {
      next(err);
   }
});

/**
 * POST /api/questions/save and POST /api/questions
 * Saves a played question into top-level savedQuestions linked by userId.
 */
router.post('/save', saveQuestionPlay);
router.post('/', saveQuestionPlay);

/**
 * GET /api/questions and GET /api/questions/saved
 * Retrieves saved questions for the authenticated user from the main savedQuestions collection.
 * Query params:
 *   limit      - max items to return (default 20, max 100)
 *   status     - optional filter: 'correct' | 'incorrect' | 'time_up'
 *   bookmarked - optional filter: 'true' (returns only bookmarked questions)
 *   sessionId  - optional filter by session ID
 */
async function getSavedQuestions(req, res, next) {
   try {
      const limit = Math.min(parseInt(req.query.limit ?? '20', 10), 100);
      const statusFilter = req.query.status;
      const bookmarkedFilter = req.query.bookmarked;
      const sessionFilter = req.query.sessionId;

      // Fetch a large batch so we can compute stats + filter in-memory
      let allDocs = [];
      try {
         const snap = await db
            .collection('savedQuestions')
            .where('userId', '==', req.uid)
            .orderBy('createdAt', 'desc')
            .limit(500)
            .get();
         allDocs = snap.docs;
      } catch (queryErr) {
         // Fallback if composite index is pending
         const fallbackSnap = await db
            .collection('savedQuestions')
            .where('userId', '==', req.uid)
            .limit(500)
            .get();

         allDocs = fallbackSnap.docs.sort((a, b) => {
            const timeA = a.data().createdAt?.toMillis ? a.data().createdAt.toMillis() : 0;
            const timeB = b.data().createdAt?.toMillis ? b.data().createdAt.toMillis() : 0;
            return timeB - timeA;
         });
      }

      // Compute overall stats across all user questions before filtering
      const stats = {
         total: allDocs.length,
         correct: allDocs.filter((d) => d.data().status === 'correct').length,
         incorrect: allDocs.filter((d) => d.data().status === 'incorrect').length,
         time_up: allDocs.filter((d) => d.data().status === 'time_up').length,
         bookmarked: allDocs.filter((d) => Boolean(d.data().bookmarked)).length,
      };

      // Apply optional status, bookmarked, and sessionId filters
      let filteredDocs = allDocs;
      if (statusFilter && ['correct', 'incorrect', 'time_up'].includes(statusFilter)) {
         filteredDocs = filteredDocs.filter((doc) => doc.data().status === statusFilter);
      }
      if (bookmarkedFilter === 'true') {
         filteredDocs = filteredDocs.filter((doc) => Boolean(doc.data().bookmarked));
      }
      if (sessionFilter) {
         filteredDocs = filteredDocs.filter((doc) => doc.data().sessionId === sessionFilter);
      }

      const hasMore = filteredDocs.length > limit;
      const pageDocs = filteredDocs.slice(0, limit);

      const questions = pageDocs.map((doc) => {
         const data = doc.data();
         const createdAt = data.createdAt?.toDate
            ? data.createdAt.toDate().toISOString()
            : data.createdAt ?? null;
         return {
            id: doc.id,
            ...data,
            bookmarked: Boolean(data.bookmarked),
            createdAt,
         };
      });

      res.json({ success: true, questions, stats, hasMore });
   } catch (err) {
      next(err);
   }
}

router.get('/saved', getSavedQuestions);
router.get('/', getSavedQuestions);

/**
 * PATCH /api/questions/:id/bookmark and PATCH /api/questions/:id
 * Toggles or sets bookmark status for a question.
 */
async function toggleQuestionBookmark(req, res, next) {
   try {
      const { id } = req.params;
      if (!id) {
         return res.status(400).json({ error: 'Question id is required.' });
      }

      const docRef = db.collection('savedQuestions').doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
         return res.status(404).json({ error: 'Question not found.' });
      }

      const data = doc.data();
      if (data.userId !== req.uid && data.uid !== req.uid) {
         return res.status(403).json({ error: 'Unauthorized to update this question.' });
      }

      const newBookmarked = req.body.bookmarked !== undefined
         ? Boolean(req.body.bookmarked)
         : !Boolean(data.bookmarked);

      await docRef.update({ bookmarked: newBookmarked });

      // If associated with a session, update the embedded question in the session doc
      if (data.sessionId) {
         try {
            const sessionRef = db.collection('users').doc(req.uid).collection('practiceSessions').doc(data.sessionId);
            const sSnap = await sessionRef.get();
            if (sSnap.exists) {
               const sData = sSnap.data();
               if (Array.isArray(sData.questionLogs)) {
                  const updatedLogs = sData.questionLogs.map((item) => {
                     if (item.id === id) {
                        return { ...item, bookmarked: newBookmarked };
                     }
                     return item;
                  });
                  await sessionRef.update({ questionLogs: updatedLogs });
               }
            }
         } catch (sessErr) {
            console.warn('Could not update session questionLogs bookmark:', sessErr);
         }
      }

      res.json({
         success: true,
         id,
         bookmarked: newBookmarked,
         message: newBookmarked ? 'Question bookmarked.' : 'Bookmark removed.',
      });
   } catch (err) {
      next(err);
   }
}

router.patch('/:id/bookmark', toggleQuestionBookmark);
router.post('/:id/bookmark', toggleQuestionBookmark);
router.patch('/saved/:id/bookmark', toggleQuestionBookmark);
router.patch('/:id', toggleQuestionBookmark);

/**
 * DELETE /api/questions/:id and DELETE /api/questions/saved/:id
 * Deletes a previously saved question play from top-level collection.
 */
async function deleteSavedQuestion(req, res, next) {
   try {
      const { id } = req.params;
      if (!id) {
         return res.status(400).json({ error: 'Question id is required.' });
      }

      const docRef = db.collection('savedQuestions').doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
         return res.status(404).json({ error: 'Saved question not found.' });
      }

      // Check ownership
      const data = doc.data();
      if (data.userId !== req.uid && data.uid !== req.uid) {
         return res.status(403).json({ error: 'Unauthorized to delete this saved question.' });
      }

      await docRef.delete();

      res.json({
         success: true,
         message: 'Saved question removed successfully.',
         id,
      });
   } catch (err) {
      next(err);
   }
}

router.delete('/saved/:id', deleteSavedQuestion);
router.delete('/:id', deleteSavedQuestion);

module.exports = router;

