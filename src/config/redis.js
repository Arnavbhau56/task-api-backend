const redis = require('redis');
const logger = require('../utils/logger');

let redisClient = null;

const connectRedis = async () => {
  if (!process.env.REDIS_URL) {
    logger.warn('Redis URL not configured, caching disabled');
    return null;
  }

  try {
    redisClient = redis.createClient({ url: process.env.REDIS_URL });
    redisClient.on('error', (err) => logger.error('Redis error:', err));
    await redisClient.connect();
    logger.info('Redis connected');
    return redisClient;
  } catch (error) {
    logger.error('Redis connection failed:', error);
    return null;
  }
};

const getRedisClient = () => redisClient;

module.exports = { connectRedis, getRedisClient };
