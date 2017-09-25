'use strict'

// Simple user database
const USER_DB = [
  {
    id: 1,
    name: 'Samantha'
  },
  {
    id: 2,
    name: 'John'
  }
]

/**
* List users
* @function get
* @param {express.Request} req
* @param {express.Response} res
* @param {Function} next
*/
async function get (req, res, next) {
  res.json(USER_DB)
  next()
}

module.exports = {
  get
}
