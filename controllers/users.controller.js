const User = require('../models/User.model')
const Like = require('../models/Like.model')
const Dislike = require('../models/Dislike.model')
const createError = require('http-errors')
const mailer = require('../config/mailer.config')
const passport = require('passport')

module.exports.register = (req, res, next) => {
  const user = new User(req.body)

  user
    .populate('likes')
    .populate('dislikes')
    .populate('role')
    .save()
    .then(user => {
      mailer.sendValidateEmail(user)
      res.status(201).json(user)
    })
    .catch(next)
}

module.exports.validate = (req, res, next) => {
  User.findOneAndUpdate({validateToken: req.params.validateToken}, {validated: true}, {new: true})
    .then(user => res.status(200).json(user))
    .catch(next)
}

module.exports.edit = (req, res, next) => {
  const {
    name,
    email,
    password,
    description,
    preferences,
    images
  } = req.body
  
  User.findById(req.currentUser.id)
    .populate('likes')
    .populate('dislikes')
    .populate('role')
    .then(user => {
      if (name) user.name = name
      if (email) user.email = email
      if (password) user.password = password
      if (description) user.description = description
      if (preferences) user.preferences = preferences
      if (images) user.images = images
      user.save()
      res.status(200).json(user)
    })
    .catch(next)
}

module.exports.delete = (req, res, next) => {
  const deleteLikesPromise = Like.deleteMany({user: req.currentUser.id, userLiked: req.currentUser.id})
  const deleteDislikesPromise = Dislike.deleteMany({user: req.currentUser.id, userLiked: req.currentUser.id})
  const deleteUserPromise = User.findByIdAndRemove(req.currentUser.id)

  Promise.all([deleteLikesPromise, deleteDislikesPromise, deleteUserPromise])
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

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        throw createError(404, 'user not found')
      } else {
        return user.checkPassword(password)
          .then(match => {
            if (!match) {
              throw createError(400, 'invalid password')
            } else {
              req.session.user = user
              res.json(user)
            }
          })
      }
    })
    .catch(next)
}

module.exports.socialLogin = (req, res, next) => {
  const socialProvider = req.params.provider
  passport.authenticate(`${socialProvider}-auth`, (error, user) => {
    if (error) {
      next(error)
    } else {
      req.session.user = user
      res.json(user)
    }
  })(req, res, next)
}

module.exports.logout = (req, res) => {
  req.session.destroy()
  res.clearCookie("connect.sid")
  res.status(204).json()
}