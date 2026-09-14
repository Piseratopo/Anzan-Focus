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
 * POST /api/questions/save and POST /api/questions
 * Saves a played question into top-level savedQuestions linked by userId.
 */
router.post('/save', saveQuestionPlay);
router.post('/', saveQuestionPlay);

/**
 * GET /api/questions and GET /api/questions/saved
 * Retrieves saved questions for the authenticated user from the main savedQuestions collection.
 */
async function getSavedQuestions(req, res, next) {
   try {
      const limit = Math.min(parseInt(req.query.limit ?? '50', 10), 100);

      let docs = [];
      try {
         const snap = await db
            .collection('savedQuestions')
            .where('userId', '==', req.uid)
            .orderBy('createdAt', 'desc')
            .limit(limit)
            .get();
         docs = snap.docs;
      } catch (queryErr) {
         // Fallback if composite index is pending: filter by userId and sort in-memory
         const fallbackSnap = await db
            .collection('savedQuestions')
            .where('userId', '==', req.uid)
            .limit(limit * 2)
            .get();

         docs = fallbackSnap.docs.sort((a, b) => {
            const timeA = a.data().createdAt?.toMillis ? a.data().createdAt.toMillis() : 0;
            const timeB = b.data().createdAt?.toMillis ? b.data().createdAt.toMillis() : 0;
            return timeB - timeA;
         }).slice(0, limit);
      }

      const questions = docs.map((doc) => ({
         id: doc.id,
         ...doc.data(),
      }));

      res.json({
         success: true,
         questions,
      });
   } catch (err) {
      next(err);
   }
}

router.get('/saved', getSavedQuestions);
router.get('/', getSavedQuestions);

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
