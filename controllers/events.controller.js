const Event = require('../models/Event.model')
const Enroll = require('../models/Enroll.model')
const Like = require('../models/Like.model')
const Dislike = require('../models/Dislike.model')

module.exports.create = (req, res, next) => {
  const event = new Event({ user: req.currentUser.id, ...req.body })

  event
    .populate('enroll')
    .save()
    .then(event => {
      res.status(201).json(event)
    })
    .catch(next)
}

module.exports.edit = (req, res, next) => {
  const {
    name,
    description,
    images,
    location,
    date,
    categories,
    capacity,
    price
  } = req.body
  
  Event.findById(req.params.id)
    .populate('enroll')
    .then(event => {
      if (name) event.name = name
      if (description) event.description = description
      if (images) event.images = images
      if (location) event.location = location
      if (date) event.date = date
      if (categories) event.categories = categories
      if (capacity) event.capacity = capacity
      if (price) event.price = price
      event.save()
      res.status(200).json(event)
    })
    .catch(next)
}

module.exports.delete = (req, res, next) => {
  Event.findByIdAndDelete(req.params.id)
    .then(() => res.status(200).json())
    .catch(next)
}

module.exports.enroll = (req, res, next) => {
  const params = { event: req.params.id, user: req.currentUser.id }
  const enroll = new Enroll(params)

  enroll.save()
    .then(enroll => res.status(201).json(enroll))
    .catch(next)
}

module.exports.getUsersEnrolled = (req, res, next) => {
  const eventId = req.params.id
  const id = req.currentUser.id
  const likesPromise = Like.find({user: id}).populate('userLiked')
  const dislikesPromise = Dislike.find({user: id}).populate('userDisliked')
  const enrollsPromise = Enroll.findById({event: eventId})

  Promise.all([likesPromise, dislikesPromise, enrollsPromise])
    .then(([likes, dislikes, enrolls]) => {
      const usersLiked = likes.map(({userLiked}) => userLiked)
      const usersDisliked = dislikes.map(({userDisliked}) => userDisliked)
      const usersEnrolled = enrolls
        .map(enroll => enroll.user)
        .filter(user => !usersLiked.includes(user.id) || !usersDisliked.includes(user.id))
      
      res.status(200).json(usersEnrolled)
    })
    .catch(next)
}