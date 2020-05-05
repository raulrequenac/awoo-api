const passport = require('passport')
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require('../models/User.model');

passport.use('google-users',
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/users/login/google/callback"
    },
    (accessToken, refreshToken, profile, done) => {
      // to see the structure of the data in received response:
      // console.log("Google account details:", profile);

      User.findOne({ social: { google: profile.id }})
        .then(user => {
          if (user) {
            done(null, user);
            return;
          }

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

          newUser.save()
            .then(savedUser => {
              done(null, savedUser)
            })
            .catch(err => done(err));

        })
        .catch(err => done(err)); // closes User.findOne()
    }
  )
)

module.exports = passport.initialize();