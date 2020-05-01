const express = require('express');
const router = express.Router();
const passport = require('passport')
const controller = require('../controllers/base.controller')
const usersController = require('../controllers/users.controller')
const locationsController = require('../controllers/locations.controller')
const routesController = require('../controllers/routes.controller')
const upload = require('./cloudinary.config')


module.exports = router.get('/', (_, res) => res.json({}))