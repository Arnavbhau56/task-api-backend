const prisma = require('../config/db');
const { getRedisClient } = require('../config/redis');

const CACHE_TTL = 300;

const invalidateCache = async (userId) => {
  const redis = getRedisClient();
  if (redis) {
    // Delete all cache keys for this user
    const keys = await redis.keys(`tasks:${userId}:*`);
    if (keys.length > 0) {
      await redis.del(keys);
    }
    await redis.del('tasks:all');
  }
};

const createTask = async (userId, data) => {
  const task = await prisma.task.create({
    data: { ...data, userId },
  });
  await invalidateCache(userId);
  return task;
};

const getTasks = async (userId, { page = 1, limit = 10, status }) => {
  const skip = (page - 1) * limit;
  const where = { userId, ...(status && { status }) };

  const cacheKey = `tasks:${userId}:${page}:${limit}:${status || 'all'}`;
  const redis = getRedisClient();

  if (redis) {
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);
  }

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.task.count({ where }),
  ]);

  const result = { tasks, total, page, pages: Math.ceil(total / limit) };

  if (redis) {
    await redis.setEx(cacheKey, CACHE_TTL, JSON.stringify(result));
  }

  return result;
};

const getTaskById = async (taskId, userId, isAdmin) => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw { statusCode: 404, message: 'Task not found' };
  if (!isAdmin && task.userId !== userId) {
    throw { statusCode: 403, message: 'Access denied' };
  }
  return task;
};

const updateTask = async (taskId, userId, isAdmin, data) => {
  const task = await getTaskById(taskId, userId, isAdmin);
  const updated = await prisma.task.update({
    where: { id: taskId },
    data,
  });
  await invalidateCache(task.userId);
  return updated;
};

const deleteTask = async (taskId, userId, isAdmin) => {
  const task = await getTaskById(taskId, userId, isAdmin);
  await prisma.task.delete({ where: { id: taskId } });
  await invalidateCache(task.userId);
};

const getAllTasks = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      skip,
      take: limit,
      include: { user: { select: { email: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.task.count(),
  ]);
  return { tasks, total, page, pages: Math.ceil(total / limit) };
};

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask, getAllTasks };
