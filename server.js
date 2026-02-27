require('./src/utils/tracer') // 👈 ADD THIS AS FIRST LINE

require('dotenv').config();
const app = require('./app');
const prisma = require('./src/config/db');
const { connectRedis } = require('./src/config/redis');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await prisma.$connect();
    logger.info('Database connected');

    await connectRedis();

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Swagger docs: http://localhost:${PORT}/api/v1/docs`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

startServer();