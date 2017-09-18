'use strict'

const assert = require('assert')
const path = require('path')
const url = require('url')
const SwaggerExpress = require('swagger-express-mw')
const express = require('express')
const logger = require('winston')
const redis = require('redis')
const Limiter = require('ratelimiter')

assert(process.env.REDIS_URI, 'REDIS_URI env. variable is required')

const app = express()
const redisClient = redis.createClient(process.env.REDIS_URI)
const swaggerUiPath = path.dirname(require.resolve('swagger-ui-dist'))
const swaggerConfig = {
  appRoot: __dirname
}

const RATE_LIMITER_MAX = 50
const RATE_LIMITER_DURATION_IN_MS = 60 * 1000

SwaggerExpress.create(swaggerConfig, (err, swaggerExpress) => {
  if (err) {
    throw err
  }

  // Ratelimiter
  app.use((req, res, next) => {
    const limiter = new Limiter({
      db: redisClient,
      id: (req) => req.connection.remoteAddress,
      max: RATE_LIMITER_MAX,
      duration: RATE_LIMITER_DURATION_IN_MS
    })

    limiter.get((err, limit) => {
      if (err) {
        logger.error('Ratelimiter', err)
        next(err)
        return
      }

      res.set('RateLimit-Limit', limit.total)
      res.set('RateLimit-Remaining', limit.remaining - 1)
      res.set('RateLimit-Reset', limit.reset)

      // Too many requests
      if (limit.remaining < 1) {
        const after = Math.floor(limit.reset - (Date.now() / 1000))

        logger.debug('Ratelimiter', limit)

        res.set('Retry-After', after)
        res.status(429).json({
          message: 'Too Many Requests'
        })
        return
      }

      next()
    })
  })

  // Swagger routes
  swaggerExpress.register(app)

  // API Docs
  app.get('/api-docs', (req, res) => {
    res.set('Content-Type', 'text/yaml')
    res.sendFile(path.join(__dirname, 'api/swagger/swagger.yaml'))
  })

  app.get('/docs', (req, res, next) => {
    if (!req.query.url) {
      const query = req.query
      query.url = '/api-docs'
      res.redirect(301, url.format({ query }))
      return
    }
    next()
  })

  app.use('/docs', express.static(swaggerUiPath))

  // Error handler
  app.use((err, req, res, next) => {
    if (err.message === 'Validation errors') {
      res.statusCode = err.statusCode
      res.json({
        message: 'Error',
        errors: err.errors
      })
      next()
      return
    }

    next(err)
  })
})

module.exports = app
