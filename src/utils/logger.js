const winston = require('winston')
const { OpenTelemetryTransportV3 } = require('@opentelemetry/winston-transport')
const path = require('path')
const fs = require('fs')

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs')
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir)
}

// Fields to never log (security)
const sensitiveFields = ['password', 'token', 'refreshToken', 'authorization']

const sanitize = winston.format((info) => {
  // Handle undefined messages
  if (info.message === undefined) {
    info.message = info.level === 'error' ? 'An error occurred' : 'Log entry'
  }
  
  sensitiveFields.forEach((field) => {
    if (info[field]) info[field] = '***REDACTED***'
    if (info.body && info.body[field]) info.body[field] = '***REDACTED***'
  })
  return info
})

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    sanitize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    // Console (colorized for dev)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),

    // All logs → combined.log
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
    }),

    // Errors only → error.log
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
    }),

    // Sends logs directly to SigNoz
    new OpenTelemetryTransportV3(),
  ],
})

module.exports = logger