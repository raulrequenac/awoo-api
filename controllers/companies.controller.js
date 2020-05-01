const Company = require('../models/company.model')
const createError = require('http-errors')
const mailer = require('../config/mailer.config')
const passport = require('passport')

module.exports.register = (req, res, next) => {
  const company = new Company(req.body)

  company
    .populate('events')
    .populate('role')
    .save()
    .then(company => {
      mailer.sendValidateEmail(company)
      res.status(201).json(company)
    })
    .catch(next)
}

module.exports.validate = (req, res, next) => {
  Company.findOneAndUpdate({validateToken: req.params.validateToken}, {validated: true}, {new: true})
    .then(company => res.status(200).json(company))
    .catch(next)
}

module.exports.edit = (req, res, next) => {
  const {
    name,
    email,
    password,
    description,
    logo
  } = req.body
  
  Company.findById(req.currentUser.id)
    .populate('events')
    .populate('role')
    .then(company => {
      if (name) company.name = name
      if (email) company.email = email
      if (password) company.password = password
      if (description) company.description = description
      if (preferences) company.preferences = preferences
      if (logo) company.logo = logo
      company.save()
      res.status(200).json(company)
    })
    .catch(next)
}

module.exports.delete = (req, res, next) => {
  Company.findByIdAndRemove(req.session.user.id)
    .then(() => {
      req.session.destroy()
      res.clearCookie("connect.sid")
      res.status(200).json()
    })
    .catch(next)
}

module.exports.login = (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw createError(400, 'missing credentials')
  }

  Company.findOne({ email: email })
    .then(company => {
      if (!company) {
        throw createError(404, 'company not found')
      } else {
        return company.checkPassword(password)
          .then(match => {
            if (!match) {
              throw createError(400, 'invalid password')
            } else {
              req.session.company = company
              res.json(company)
            }
          })
      }
    })
    .catch(next)
}

module.exports.socialLogin = (req, res, next) => {
  passport.authenticate('google-companies', (error, company) => {
    if (error) {
      next(error)
    } else {
      req.session.company = company
      res.json(company)
    }
  })(req, res, next)
}

module.exports.logout = (req, res) => {
  req.session.destroy()
  res.clearCookie("connect.sid")
  res.status(204).json()
}