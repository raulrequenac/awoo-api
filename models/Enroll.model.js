const mongoose = require('mongoose');

const enrollSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  }
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

const Enroll = mongoose.model('Enroll', enrollSchema);

module.exports = Enroll;