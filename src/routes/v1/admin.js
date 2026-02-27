const express = require('express');
const taskController = require('../../controllers/taskController');
const { authenticateToken, authorizeRole } = require('../../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/v1/admin/tasks:
 *   get:
 *     tags: [Admin]
 *     summary: Get all tasks (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200: { description: All tasks retrieved }
 *       403: { description: Insufficient permissions }
 */
router.get(
  '/tasks',
  authenticateToken,
  authorizeRole('ADMIN'),
  taskController.getAllTasks
);

module.exports = router;
