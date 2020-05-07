const passport = require('passport')
const GoogleStrategy = require("passport-google-oauth20").Strategy
const FBStrategy = require('passport-facebook').Strategy;
const User = require('../models/User.model');

passport.use('google-users', new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/users/login/google/callback',
}, authenticateOAuthUser))

passport.use('facebook-auth', new FBStrategy({
  clientID: process.env.FB_AUTH_CLIENT_ID,
  clientSecret: process.env.FB_AUTH_CLIENT_SECRET,
  callbackURL: '/users/login/callback/facebook',
  profileFields: ['displayName', 'emails']
}, authenticateOAuthUser));

const authenticateOAuthUser = (accessToken, refreshToken, profile, done) => {
  User.findOne({ s[`social.${profile.provider.toLowerCase()}`]: profile.id })
    .then(user => {
      if (user) {
        next(null, user)
      } else {
        const newUser = new User({
          name: profile.displayName,
          images: profile.photos.map(image => image.value),
          age: profile.birthday,
          email: profile.emails[0].value,
          validated: true,
          password: profile.provider + Math.random().toString(36).substring(7),
          social: {
            [profile.provider.toLowerCase()]: profile.id
          }
        })

        return newUser.save()
          .then(savedUser => {
            done(null, savedUser)
          })
          .catch(err => next(err))
      }
    })
    .catch(err => next(err))
}

module.exports = passport.initialize();