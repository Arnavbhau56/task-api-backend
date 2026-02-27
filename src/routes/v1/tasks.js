const express = require('express');
const { body } = require('express-validator');
const taskController = require('../../controllers/taskController');
const validate = require('../../middleware/validate');
const { authenticateToken, authorizeRole } = require('../../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/v1/tasks:
 *   post:
 *     tags: [Tasks]
 *     summary: Create a new task
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               status: { type: string, enum: [TODO, IN_PROGRESS, DONE] }
 *               priority: { type: string, enum: [LOW, MEDIUM, HIGH] }
 *     responses:
 *       201: { description: Task created }
 */
router.post(
  '/',
  authenticateToken,
  [
    body('title').notEmpty().withMessage('Title required'),
    body('description').optional().isString(),
    body('status').optional().isIn(['TODO', 'IN_PROGRESS', 'DONE']),
    body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']),
  ],
  validate,
  taskController.createTask
);

/**
 * @swagger
 * /api/v1/tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: Get user tasks with pagination
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [TODO, IN_PROGRESS, DONE] }
 *     responses:
 *       200: { description: Tasks retrieved }
 */
router.get('/', authenticateToken, taskController.getTasks);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   get:
 *     tags: [Tasks]
 *     summary: Get task by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Task retrieved }
 *       404: { description: Task not found }
 */
router.get('/:id', authenticateToken, taskController.getTaskById);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   put:
 *     tags: [Tasks]
 *     summary: Update task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               status: { type: string }
 *               priority: { type: string }
 *     responses:
 *       200: { description: Task updated }
 */
router.put(
  '/:id',
  authenticateToken,
  [
    body('title').optional().notEmpty(),
    body('status').optional().isIn(['TODO', 'IN_PROGRESS', 'DONE']),
    body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']),
  ],
  validate,
  taskController.updateTask
);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   delete:
 *     tags: [Tasks]
 *     summary: Delete task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Task deleted }
 */
router.delete('/:id', authenticateToken, taskController.deleteTask);

module.exports = router;
