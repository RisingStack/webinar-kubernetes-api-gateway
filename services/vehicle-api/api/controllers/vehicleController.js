'use strict'

// Simple vehicle database
const VEHICLE_DB = [
  {
    id: 1,
    userId: 1,
    name: 'Toyota Corolla'
  },
  {
    id: 2,
    userId: 1,
    name: 'Porsche 911'
  },
  {
    id: 3,
    userId: 2,
    name: 'Ford Focus'
  }
]

/**
* List vehicles
* @function get
* @param {express.Request} req
* @param {express.Response} res
* @param {Function} next
*/
async function get (req, res, next) {
  // Filter vehicles by user ids
  const userIds = req.swagger.params.userIds.value
  const vehicles = userIds
    ? VEHICLE_DB.filter((vehicle) => userIds.includes(vehicle.userId))
    : VEHICLE_DB

  res.json(vehicles)
  next()
}

module.exports = {
  get
}
