'use strict'

const jaeger = require('jaeger-client')
const UDPSender = require('jaeger-client/dist/src/reporters/udp_sender').default
const Instrument = require('@risingstack/opentracing-auto')

const sampler = new jaeger.RateLimitingSampler(10)
const reporter = new jaeger.RemoteReporter(new UDPSender({
  host: process.env.JAEGER_HOST
}))
const tracer = new jaeger.Tracer('user-api', reporter, sampler)

// eslint-disable-next-line
new Instrument({
  tracers: [tracer],
  httpTimings: true
})

require('./server')

process.on('unhandledRejection', (err, promise) => {
  console.error('An unhandledRejection occurred')
  console.error(err)
  console.error(`Rejected Promise: ${promise}`)
  console.error(`Rejection: ${err}`)
  process.exit(1)
})
