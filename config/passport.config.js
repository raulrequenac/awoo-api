const passport = require('passport')
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy
const FBStrategy = require('passport-facebook').Strategy;
const User = require('../models/User.model');

const authenticateOAuthUser = (accessToken, refreshToken, profile, next) => {
  User.findOne({ [`social.${profile.provider.toLowerCase()}`]: profile.id })
    .then(user => {
      if (user) {
        next(null, user)
      } else {
        const newUser = new User({
          name: profile.displayName,
          images: [profile._json.picture],
          age: profile.birthday,
          email: profile.emails ? profile.emails[0].value : profile.user.email,
          validated: true,
          password: profile.provider + Math.random().toString(36).substring(7),
          social: {
            [profile.provider.toLowerCase()]: profile.id
          }
        })
        console.log(newUser)

        return newUser.save()
          .then(savedUser => {
            next(null, savedUser)
          })
          .catch(err => next(err))
      }
    })
    .catch(err => next(err))
}

passport.use(
  "google-users",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/users/login/google/callback",
    },
    authenticateOAuthUser
  )
)

passport.use(
  "facebook-auth",
  new FBStrategy(
    {
      clientID: process.env.FB_AUTH_CLIENT_ID,
      clientSecret: process.env.FB_AUTH_CLIENT_SECRET,
      callbackURL: "/users/login/callback/facebook",
      profileFields: ["displayName", "emails"],
    },
    authenticateOAuthUser
  )
)

module.exports = passport.initialize();