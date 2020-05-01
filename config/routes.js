const express = require('express')
const router = express.Router()
const passport = require('passport')
const uploadCloud = require('./cloudinary.config')
const usersController = require('../controllers/users.controller')
const companiesController = require('../controllers/companies.controller')
const eventsController = require('../controllers/events.controller')
const matchesController = require('../controllers/matches.controller')

//Users
router.post('/users/register', uploadCloud.array('images'), usersController.register)
router.get('/users/validate/:validateToken', usersController.validate)
router.patch('/users/edit', usersController.edit)
router.post('/users/delete', usersController.delete)
router.post('/users/login', usersController.login)
router.post('/users/login/google', 
  passport.authenticate('google-users', {scope:['openid', 'profile', 'email']})
)
router.get('/users/login/google/callback', usersController.socialLogin)
router.post('/users/logout', usersController.logout)

//Companies
router.post('/companies/register', uploadCloud.array('images'), companiesController.register)
router.get('/companies/validate/:validateToken', companiesController.validate)
router.patch('/companies/edit', companiesController.edit)
router.post('/companies/delete', companiesController.delete)
router.post('/companies/login', companiesController.register)
router.post('/companies/login/google', 
  passport.authenticate('google-companies', {scope:['openid', 'profile', 'email']})
)
router.get('/companies/login/google/callback', companiesController.socialLogin)
router.post('/companies/logout', companiesController.logout)

//Events
router.post('/events/create', eventsController.create)
router.patch('/events/:eventId/edit', eventsController.edit)
router.post('/events/:eventId/delete', eventsController.delete)
router.post('/events/:eventId/enroll', eventsController.enroll)
router.get('/events/:eventId/enrolled', eventsController.getUsersEnrolled)

//Matches
router.get('/users/matches', matchesController.getMatches)
router.get('/users/matches/:userId/events-in-common', eventsController.eventsInCommon)
router.post('/users/like/:userId', matchesController.like)
router.post('/users/dislike/:userId', matchesController.dislike)

module.exports = router