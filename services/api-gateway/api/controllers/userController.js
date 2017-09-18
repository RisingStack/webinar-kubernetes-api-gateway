'use strict'

const assert = require('assert')
const logger = require('winston')
const SwaggerClient = require('swagger-client-sync')

assert(process.env.USER_API_SERVICE_HOST, 'USER_API_SERVICE_HOST is required')
assert(process.env.USER_API_SERVICE_PORT, 'USER_API_SERVICE_PORT is required')
assert(process.env.VEHICLE_API_SERVICE_HOST, 'VEHICLE_API_SERVICE_HOST is required')
assert(process.env.VEHICLE_API_SERVICE_PORT, 'VEHICLE_API_SERVICE_PORT is required')

const userAPIUri = `http://${process.env.USER_API_SERVICE_HOST}:${process.env.USER_API_SERVICE_PORT}`
const vehicleAPIUri = `http://${process.env.VEHICLE_API_SERVICE_HOST}:${process.env.VEHICLE_API_SERVICE_PORT}`

// TODO: In production you don't want to kill the gateway because of dependency issue
assert(userAPIUri.state !== 'rejected', 'User API swagger file is not available')
assert(vehicleAPIUri.state !== 'rejected', 'Vehicle API swagger file is not available')

const User = SwaggerClient(`${userAPIUri}/api-docs`)
const Vehicle = SwaggerClient(`${vehicleAPIUri}/api-docs`)

/**
* List users via user-api and vehicle-api
* @function get
* @param {Object} req
* @param {Object} res
* @param {Function} next
*/
async function get (req, res, next) {
  const { obj: users } = await User.apis.user.get()
  logger.debug('Get users', users)

  const userIds = users.map((user) => user.id)
  const { obj: vehicles } = await Vehicle.apis.vehicle.get({ userIds })
  const vehiclesByUserId = vehicles.reduce((vehiclesByUserId, vehicle) => {
    vehiclesByUserId[vehicle.userId] = vehiclesByUserId[vehicle.userId] || []
    vehiclesByUserId[vehicle.userId].push(vehicle)
    return vehiclesByUserId
  }, {})
  logger.debug('Get vehicles', vehicles)

  const responseUsers = users.map((user) => {
    const userVehicles = vehiclesByUserId[user.id] || []

    return Object.assign(user, {
      vehicles: userVehicles.map((vehicle) => ({
        id: vehicle.id,
        name: vehicle.name
      }))
    })
  })

  res.json(responseUsers)
  next()
}

module.exports = {
  get
}
