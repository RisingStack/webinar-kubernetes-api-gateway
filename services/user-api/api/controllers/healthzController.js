'use strict'

/**
* List users via user-api and vehicle-api
* @function get
* @param {express.Request} req
* @param {express.Response} res
* @param {Function} next
*/
function get (req, res, next) {
  res.json({
    status: 'ok'
  })
  next()
}

module.exports = {
  get
}
