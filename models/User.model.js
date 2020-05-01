const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { credentials, encryptPassword } = require('../constants/credentials')

const genders = ['Male', 'Female']
const genderPreference = [...genders, 'All']

const userSchema = new mongoose.Schema({
  ...credentials,
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

encryptPassword(userSchema)

userSchema.methods.checkPassword = (password) =>  bcrypt.compare(password, this.password)

userSchema.virtual('role').get(function() {
  return "user";
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

const User = mongoose.model('User', userSchema);

module.exports = User;