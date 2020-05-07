const express = require('express')
const router = express.Router()
const passport = require('passport')
const uploadCloud = require('./cloudinary.config')
const usersController = require('../controllers/users.controller')
const eventsController = require('../controllers/events.controller')
const matchesController = require('../controllers/matches.controller')

router.get('/', (_, res) => res.json())

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

//Events
router.post('/events/create', eventsController.create)
router.patch('/events/:eventId/edit', eventsController.edit)
router.post('/events/:eventId/delete', eventsController.delete)
router.post('/events/:eventId/enroll', eventsController.enroll)
router.get('/events/:eventId/enrolled', eventsController.getUsersEnrolled)

//Matches
router.get('/users/matches', matchesController.getMatches)
router.get('/users/matches/:userId/events-in-common', matchesController.eventsInCommon)
router.post('/users/like/:userId', matchesController.like)
router.post('/users/dislike/:userId', matchesController.dislike)

module.exports = router