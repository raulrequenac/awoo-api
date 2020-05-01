const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LikeSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  userLiked: {
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

const like = new mongoose.model('Like', LikeSchema)

module.exports = like