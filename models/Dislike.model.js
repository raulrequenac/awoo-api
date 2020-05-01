const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DislikeSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  userDisliked: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
},{
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

const dislike = new mongoose.model('Dislike', DislikeSchema)

module.exports = dislike