const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { credentials, encryptPassword } = require('../constants/credentials')

const companySchema = new mongoose.Schema({
  ...credentials,
  logo: String
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

encryptPassword(companySchema)

companySchema.methods.checkPassword = (password) => bcrypt.compare(password, this.password)

companySchema.virtual('events', {
  ref: 'Event',
  localField: 'id',
  foreignField: 'company',
  justOne: false,
})

companySchema.virtual('role').get(() =>  "company")

const Company = mongoose.model('Company', companySchema)

module.exports = Company