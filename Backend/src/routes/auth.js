const { Router } = require('express');
const { auth, db } = require('../config/firebase');
const { FieldValue } = require('firebase-admin/firestore');
const { verifyToken } = require('../middleware/auth');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'anzan-focus-jwt-secret-key-2025';

function generateAuthToken(user) {
  return jwt.sign(
    { uid: user.uid, email: user.email, name: user.name || '' },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

const router = Router();

/**
 * POST /api/auth/register
 * Registers a new user with Firebase Auth and initializes their Firestore profile document.
 * 
 * Body: {
 *   fullName: string,
 *   email: string,
 *   password: string,
 *   confirmPassword?: string
 * }
 */
router.post('/register', async (req, res, next) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    // Validation
    const trimmedName = (fullName ?? '').trim();
    const trimmedEmail = (email ?? '').trim().toLowerCase();

    if (!trimmedName) {
      return res.status(400).json({ error: 'Full name is required.' });
    }

    if (!trimmedEmail) {
      return res.status(400).json({ error: 'Email address is required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    if (!password || typeof password !== 'string') {
      return res.status(400).json({ error: 'Password is required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    if (confirmPassword !== undefined && confirmPassword !== password) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    // Create user with Firebase Auth Admin SDK
    let userRecord;
    try {
      userRecord = await auth.createUser({
        email: trimmedEmail,
        password: password,
        displayName: trimmedName,
      });
    } catch (firebaseErr) {
      if (firebaseErr.code === 'auth/email-already-exists') {
        return res.status(409).json({ error: 'This email is already registered. Please login instead.' });
      }
      if (firebaseErr.code === 'auth/invalid-email') {
        return res.status(400).json({ error: 'Invalid email address provided.' });
      }
      if (firebaseErr.code === 'auth/weak-password' || firebaseErr.code === 'auth/invalid-password') {
        return res.status(400).json({ error: 'Password is too weak. Must be at least 6 characters.' });
      }
      throw firebaseErr;
    }

    // Initialize user profile in Firestore
    const userDocRef = db.collection('users').doc(userRecord.uid);
    await userDocRef.set({
      name: trimmedName,
      email: trimmedEmail,
      createdAt: FieldValue.serverTimestamp(),
      location: '',
      isPublic: false,
      avatarUrl: '',
    });

    const token = generateAuthToken({
      uid: userRecord.uid,
      email: userRecord.email,
      name: userRecord.displayName,
    });

    return res.status(201).json({
      success: true,
      message: 'Account successfully registered.',
      token,
      idToken: token,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        name: userRecord.displayName,
      },
    });
  } catch (err) {
    console.error('[Register Error]', err);
    next(err);
  }
});

/**
 * POST /api/auth/sync-profile
 * Verifies a Firebase Auth ID token and ensures the Firestore profile exists.
 * Used when authenticating via Firebase client SDK.
 */
router.post('/sync-profile', verifyToken, async (req, res, next) => {
  try {
    const userDocRef = db.collection('users').doc(req.uid);
    const doc = await userDocRef.get();

    if (!doc.exists) {
      const newProfile = {
        name: req.user.name || req.body.fullName || '',
        email: req.user.email || '',
        createdAt: FieldValue.serverTimestamp(),
        location: '',
        isPublic: false,
        avatarUrl: req.user.picture || '',
      };
      await userDocRef.set(newProfile);
      return res.json({ success: true, uid: req.uid, ...newProfile });
    }

    return res.json({ success: true, uid: req.uid, ...doc.data() });
  } catch (err) {
    console.error('[Sync Profile Error]', err);
    next(err);
  }
});

/**
 * POST /api/auth/login
 * Standard credential authentication via Firebase Auth REST API (if apiKey configured) or user profile retrieval.
 * Note: Never calls createCustomToken to avoid IAM Service Account API requirement.
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const trimmedEmail = (email ?? '').trim().toLowerCase();

    if (!trimmedEmail) {
      return res.status(400).json({ error: 'Email address is required.' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Password is required.' });
    }

    const apiKey = process.env.FIREBASE_API_KEY;
    if (apiKey) {
      // Authenticate directly via Firebase Auth REST API
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: trimmedEmail,
            password,
            returnSecureToken: true,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        const errCode = data?.error?.message;
        if (
          errCode === 'EMAIL_NOT_FOUND' ||
          errCode === 'INVALID_PASSWORD' ||
          errCode === 'INVALID_LOGIN_CREDENTIALS'
        ) {
          return res.status(401).json({ error: 'Invalid email or password.' });
        }
        return res.status(400).json({ error: data?.error?.message ?? 'Authentication failed.' });
      }

      // Fetch Firestore profile
      const userDoc = await db.collection('users').doc(data.localId).get();
      const profile = userDoc.exists ? userDoc.data() : {};

      return res.json({
        success: true,
        message: 'Logged in successfully.',
        idToken: data.idToken,
        refreshToken: data.refreshToken,
        expiresIn: data.expiresIn,
        user: {
          uid: data.localId,
          email: data.email,
          name: profile.name || data.displayName || '',
          ...profile,
        },
      });
    }

    // Lookup user in Firebase Auth without custom tokens
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(trimmedEmail);
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }
      throw err;
    }

    const userDoc = await db.collection('users').doc(userRecord.uid).get();
    const profile = userDoc.exists ? userDoc.data() : {};

    const token = generateAuthToken({
      uid: userRecord.uid,
      email: userRecord.email,
      name: profile.name || userRecord.displayName || '',
    });

    return res.json({
      success: true,
      message: 'User authenticated.',
      token,
      idToken: token,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        name: profile.name || userRecord.displayName || '',
        ...profile,
      },
    });
  } catch (err) {
    console.error('[Login Error]', err);
    next(err);
  }
});

module.exports = router;
