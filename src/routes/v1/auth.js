const express = require('express');
const { body } = require('express-validator');
const authController = require('../../controllers/authController');
const validate = require('../../middleware/validate');
const { authenticateToken } = require('../../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 6 }
 *               role: { type: string, enum: [USER, ADMIN] }
 *     responses:
 *       201: { description: User registered }
 *       422: { description: Validation error }
 */
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 characters'),
    body('role').optional().isIn(['USER', 'ADMIN']),
  ],
  validate,
  authController.register
);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Login successful }
 *       401: { description: Invalid credentials }
 */
router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').notEmpty(),
  ],
  validate,
  authController.login
);

/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200: { description: Token refreshed }
 *       403: { description: Invalid refresh token }
 */
router.post(
  '/refresh',
  [body('refreshToken').notEmpty()],
  validate,
  authController.refresh
);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Logged out }
 */
router.post('/logout', authenticateToken, authController.logout);

module.exports = router;
