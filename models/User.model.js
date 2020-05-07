const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const EMAIL_PATTERN = /^(([^<>()\[\]\.,:\s@\"]+(\.[^<>()\[\]\.,:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,:\s@\"]+\.)+[^<>()[\]\.,:\s@\"]{2,})$/i
const SALT_WORK_FACTOR = 10

const generateRandomToken = () =>  Math.random().toString(36).substring(2, 15) + 
  Math.random().toString(36).substring(2, 15) + 
  Math.random().toString(36).substring(2, 15) + 
  Math.random().toString(36).substring(2, 15)

const genders = ['Male', 'Female']
const genderPreference = [...genders, 'All']

const userSchema = new mongoose.Schema({
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
    google: String,
    facebook: String
  },
  age: {
    type: Date,
    max: `${new Date().getFullYear()-18}-${new Date().getMonth()}-${new Date().getDay()}`,
    required: true
  },
  gender: {
    type: String,
    enum: genders
  },
  preferences: {
    gender: {
      type: String,
      enum: genderPreference,
      default: 'All'
    },
    ageRange: {
      min: {
        type: Number,
        min: 18,
        default: 18
      },
      max: {
        type: Number,
        min: 18,
        default: 90
      }
    }
  },
  images: [String]
}, { 
  timestamps: true, 
  toJSON: {
    transform: (doc, ret) => {
      ret.id = doc._id
      delete ret._id
      delete ret.__v
      delete ret.password
      return ret
    }
  }
})

userSchema.pre('save', function (next) {
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

userSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password)
} 

userSchema.virtual('events', {
  ref: 'Event',
  localField: 'id',
  foreignField: 'user',
  justOne: false,
})

userSchema.virtual('like', {
  ref: 'Like',
  localField: 'id',
  foreignField: 'user'
})

userSchema.virtual('dislike', {
  ref: 'Dislike',
  localField: 'id',
  foreignField: 'user'
})

const User = mongoose.model('User', userSchema)

module.exports = User