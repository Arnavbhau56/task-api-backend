const express = require('express');
const authRoutes = require('./auth');
const taskRoutes = require('./tasks');
const adminRoutes = require('./admin');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
