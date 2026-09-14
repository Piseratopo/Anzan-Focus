const { Router } = require('express');
const { verifyToken } = require('../middleware/auth');
const { db } = require('../config/firebase');

const router = Router();

// All routes here require a valid Firebase ID token
router.use(verifyToken);

/**
 * Default practice settings fallback
 */
const DEFAULT_PRACTICE_SETTINGS = {
  operations: ['addition', 'subtraction'],
  minValue: 1,
  maxValue: 100,
  allowNegative: false,
  operands: 3,
  speed: 2.5,
  timerType: 'per_operand',
  questionCount: 10,
  soundEffects: true,
  dictationMode: false,
};

/**
 * GET /api/users/me
 * Returns the authenticated user's Firestore profile document.
 */
router.get('/me', async (req, res, next) => {
  try {
    const doc = await db.collection('users').doc(req.uid).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'User profile not found.' });
    }

    res.json({ uid: doc.id, ...doc.data() });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/users/settings (also /api/users/config)
 * Returns the authenticated user's practice configuration from Firestore.
 */
const getSettingsHandler = async (req, res, next) => {
  try {
    const doc = await db.collection('users').doc(req.uid).get();

    if (!doc.exists) {
      return res.json({ settings: DEFAULT_PRACTICE_SETTINGS });
    }

    const data = doc.data();
    const settings = {
      ...DEFAULT_PRACTICE_SETTINGS,
      ...(data.settings || {}),
    };

    res.json({ success: true, settings });
  } catch (err) {
    next(err);
  }
};

router.get('/settings', getSettingsHandler);
router.get('/config', getSettingsHandler);

/**
 * PUT or POST /api/users/settings (also /api/users/config)
 * Stores the authenticated user's practice configuration into Firestore.
 */
const saveSettingsHandler = async (req, res, next) => {
  try {
    const incoming = req.body.settings || req.body;
    if (!incoming || typeof incoming !== 'object') {
      return res.status(400).json({ error: 'Invalid settings payload.' });
    }

    // Sanitize and validate settings fields
    const sanitized = {};

    if (Array.isArray(incoming.operations)) {
      const validOps = ['addition', 'subtraction', 'multiplication', 'division'];
      const filtered = incoming.operations.filter((op) => validOps.includes(op));
      sanitized.operations = filtered.length > 0 ? filtered : ['addition', 'subtraction'];
    }

    if (incoming.minValue !== undefined) {
      sanitized.minValue = Math.max(1, parseInt(incoming.minValue, 10) || 1);
    }

    if (incoming.maxValue !== undefined) {
      sanitized.maxValue = Math.max(
        sanitized.minValue ?? 1,
        parseInt(incoming.maxValue, 10) || 100
      );
    }

    if (incoming.allowNegative !== undefined) {
      sanitized.allowNegative = Boolean(incoming.allowNegative);
    }

    if (incoming.operands !== undefined) {
      sanitized.operands = Math.max(2, Math.min(100, parseInt(incoming.operands, 10) || 3));
    }

    if (incoming.speed !== undefined) {
      sanitized.speed = Math.max(0.1, Math.min(60, parseFloat(incoming.speed) || 2.5));
    }

    if (incoming.timerType !== undefined) {
      sanitized.timerType =
        incoming.timerType === 'whole_expression' ? 'whole_expression' : 'per_operand';
    }

    // Number of questions field (questionCount)
    if (incoming.questionCount !== undefined) {
      sanitized.questionCount = Math.max(1, Math.min(100, parseInt(incoming.questionCount, 10) || 10));
    }

    if (incoming.soundEffects !== undefined) {
      sanitized.soundEffects = Boolean(incoming.soundEffects);
    }

    if (incoming.dictationMode !== undefined) {
      sanitized.dictationMode = Boolean(incoming.dictationMode);
    }

    // Fetch existing settings to merge
    const userDocRef = db.collection('users').doc(req.uid);
    const existingDoc = await userDocRef.get();
    const existingSettings = existingDoc.exists ? existingDoc.data()?.settings || {} : {};

    const updatedSettings = {
      ...DEFAULT_PRACTICE_SETTINGS,
      ...existingSettings,
      ...sanitized,
    };

    await userDocRef.set(
      {
        settings: updatedSettings,
        settingsUpdatedAt: new Date(),
      },
      { merge: true }
    );

    res.json({
      success: true,
      message: 'User configuration saved successfully.',
      settings: updatedSettings,
    });
  } catch (err) {
    console.error('[Save Settings Error]', err);
    next(err);
  }
};

router.put('/settings', saveSettingsHandler);
router.post('/settings', saveSettingsHandler);
router.put('/config', saveSettingsHandler);
router.post('/config', saveSettingsHandler);

/**
 * PUT /api/users/me
 * Partially updates the authenticated user's Firestore profile.
 * Allowed fields: name, location, isPublic, avatarUrl
 */
router.put('/me', async (req, res, next) => {
  try {
    const ALLOWED_FIELDS = ['name', 'location', 'isPublic', 'avatarUrl'];
    const updates = {};

    for (const field of ALLOWED_FIELDS) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields provided.' });
    }

    await db.collection('users').doc(req.uid).set(updates, { merge: true });

    res.json({ message: 'Profile updated.', updates });
  } catch (err) {
    next(err);
  }
});

module.exports = router;


