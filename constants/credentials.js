const bcrypt = require('bcrypt')

const EMAIL_PATTERN = /^(([^<>()\[\]\.,:\s@\"]+(\.[^<>()\[\]\.,:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,:\s@\"]+\.)+[^<>()[\]\.,:\s@\"]{2,})$/i
const SALT_WORK_FACTOR = 10

const generateRandomToken = () =>  Math.random().toString(36).substring(2, 15) + 
  Math.random().toString(36).substring(2, 15) + 
  Math.random().toString(36).substring(2, 15) + 
  Math.random().toString(36).substring(2, 15)


const credentials = {
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name needs at last 3 chars'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [EMAIL_PATTERN, 'Email is invalid']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password needs at last 8 chars']
  },
  description: String,
  validateToken: {
    type: String,
    default: generateRandomToken
  },
  validated: {
    type: Boolean,
    default: true
  },
  social: {
    google: String
  }
}

const encryptPassword = (schema) => {
  schema.pre('save', function (next) {
    const user = this

    if (user.isModified('password')) {
      bcrypt.genSalt(SALT_WORK_FACTOR)
        .then(salt => {
          return bcrypt.hash(user.password, salt)
            .then(hash => {
              user.password = hash
              next()
            })
        })
        .catch(error => next(error))
    } else {
      next()
    }
  })
}

module.exports = {
  credentials,
  encryptPassword
}