'use strict'

const logger = require('winston')
const app = require('./app')

const port = process.env.PORT || 3000
const logLevel = process.env.LOG_LEVEL || 'debug'

logger.level = logLevel

const server = app.listen(port, (err) => {
  if (err) {
    logger.error(err)
    return
  }

  logger.info(`Server is listening on ${port}`)
})

process.on('SIGTERM', () => {
  logger.info('SIGTERM received')

  server.close((err) => {
    if (err) {
      logger.error('Graceful shutdown', err)
      process.exit(1)
    }

    logger.info('Server stopped')
    process.exit(0)
  })
})
