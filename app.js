const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const v1Routes = require('./src/routes/v1');
const errorHandler = require('./src/middleware/error');
const morgan = require('morgan')
const logger = require('./src/utils/logger')

const app = express();

app.use(morgan('combined', {
  stream: {
    write: (message) => logger.http(message.trim())
  }
}))

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests' },
});
app.use(limiter);

app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1', v1Routes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorHandler);

module.exports = app;
