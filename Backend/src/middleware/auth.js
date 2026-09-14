const { auth, db } = require('../config/firebase');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'anzan-focus-jwt-secret-key-2025';

/**
 * Express middleware that verifies an auth token sent in the
 * Authorization header as a Bearer token.
 *
 * Supports:
 *  1. Custom backend JWT
 *  2. Firebase ID token
 *  3. Valid Firestore user UID (seamless fallback for sessions without JWT)
 *
 * On success: attaches `req.user` and `req.uid` (string UID).
 * On failure: responds with 401 Unauthorized.
 */
async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization ?? '';

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header.' });
  }

  const rawToken = authHeader.slice(7).trim(); // strip "Bearer "

  if (!rawToken) {
    return res.status(401).json({ error: 'Missing token.' });
  }

  // 1. Verify custom backend JWT
  try {
    const decoded = jwt.verify(rawToken, JWT_SECRET);
    req.user = decoded;
    req.uid = decoded.uid;
    return next();
  } catch (err) {
    // Continue to next verification method
  }

  // 2. Verify Firebase ID token
  try {
    const decoded = await auth.verifyIdToken(rawToken);
    req.user = decoded;
    req.uid = decoded.uid;
    return next();
  } catch (err) {
    // Continue to next verification method
  }

  // 3. Fallback: Authenticated session UID
  try {
    const userDoc = await db.collection('users').doc(rawToken).get();
    if (userDoc.exists) {
      req.user = { uid: userDoc.id, ...userDoc.data() };
      req.uid = userDoc.id;
      return next();
    }
  } catch (err) {
    // Continue
  }

  return res.status(401).json({ error: 'Invalid or expired token.' });
}

module.exports = { verifyToken };
