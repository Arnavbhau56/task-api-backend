const taskService = require('../services/taskService');

const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.user.userId, req.body);
    res.status(201).json({
      success: true,
      message: 'Task created',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const { page, limit, status } = req.query;
    const result = await taskService.getTasks(req.user.userId, {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      status,
    });
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(
      req.params.id,
      req.user.userId,
      req.user.role === 'ADMIN'
    );
    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(
      req.params.id,
      req.user.userId,
      req.user.role === 'ADMIN',
      req.body
    );
    res.json({
      success: true,
      message: 'Task updated',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    await taskService.deleteTask(
      req.params.id,
      req.user.userId,
      req.user.role === 'ADMIN'
    );
    res.json({
      success: true,
      message: 'Task deleted',
    });
  } catch (error) {
    next(error);
  }
};

const getAllTasks = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await taskService.getAllTasks({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
    });
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask, getAllTasks };
