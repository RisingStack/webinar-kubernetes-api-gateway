'use strict'

const assert = require('assert')
const logger = require('winston')
const SwaggerClient = require('swagger-client')

assert(process.env.USER_API_SERVICE_HOST, 'USER_API_SERVICE_HOST is required')
assert(process.env.USER_API_SERVICE_PORT, 'USER_API_SERVICE_PORT is required')
assert(process.env.VEHICLE_API_SERVICE_HOST, 'VEHICLE_API_SERVICE_HOST is required')
assert(process.env.VEHICLE_API_SERVICE_PORT, 'VEHICLE_API_SERVICE_PORT is required')

const userAPIUri = `http://${process.env.USER_API_SERVICE_HOST}:${process.env.USER_API_SERVICE_PORT}`
const vehicleAPIUri = `http://${process.env.VEHICLE_API_SERVICE_HOST}:${process.env.VEHICLE_API_SERVICE_PORT}`

let userClient
let vehicleClient

/**
* List users via user-api and vehicle-api
* @function get
* @param {Object} req
* @param {Object} res
* @param {Function} next
*/
async function get (req, res, next) {
  const User = await getUserClient()
  const { obj: users } = await User.apis.user.get()
  logger.debug('Get users', users)

  const userIds = users.map((user) => user.id)
  const Vehicle = await getVehicleClient()
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

/**
* @function getUserClient
* @param {Promise} client - swagger client
*/
async function getUserClient () {
  if (!userClient) {
    logger.debug('User Client resolve')
    userClient = await SwaggerClient(`${userAPIUri}/api-docs`)
    logger.debug('User Client succesfully resolved')
  }
  return userClient
}

/**
* @function getVehicleClient
* @param {Promise} client - swagger client
*/
async function getVehicleClient () {
  if (!vehicleClient) {
    logger.debug('Vehicle Client resolve')
    vehicleClient = await SwaggerClient(`${vehicleAPIUri}/api-docs`)
    logger.debug('Vehicle Client succesfully resolved')
  }
  return vehicleClient
}

module.exports = {
  get
}
