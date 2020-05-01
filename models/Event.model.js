const mongoose = require('mongoose')
const categories = require('../constants/categories')

const eventSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [8, 'Name needs at last 8 chars'],
    trim: true
  },
  description: String,
  images: [String],
  location: {
    type: String,
    required: [true, 'Location is required'],
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now,
    min: Date.now
  },
  categories: {
    type: [String],
    enum: categories
  },
  capacity: Number,
  price: Number
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = doc._id
      delete ret._id
      delete ret.__v
      return ret
    }
  }
})

eventSchema.virtual('enroll', {
  ref: 'Enroll',
  localField: 'id',
  foreignField: 'event',
  justOne: false,
})

const Event = mongoose.model('Event', eventSchema)

module.exports = Event