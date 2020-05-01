const Like = require('../models/Like.model')
const Dislike = require('../models/Dislike.model')
const Enroll = require('../models/Enroll.model')

module.exports.getMatches = (req, res, next) => {
  const id = req.currentUser.id
  const LikePromise = Like.find({ user: id }).populate('userLiked')
  const LikedPromise = Like.find({ userLiked: id }).populate('user')

  Promise.all([LikePromise, LikedPromise])
    .then(([likes, likeds]) => {
      const matches = likeds
        .map(({ user }) => user)
        .filter(user => likes.map(({ userLiked }) => userLiked.id).includes(user.id))
      res.json(matches)
    })
    .catch(next)
}

module.exports.eventsInCommon = (req, res, next) => {
  const id = req.params.id
  const userEnrollsPromise = Enroll.find({user: req.currentUser.id}).populate('event')
  const matchEnrollsPromise = Enroll.find({user: id}).populate('event')

  Promise.all([userEnrollsPromise, matchEnrollsPromise])
    .then(([userEnrolls, matchEnrolls]) => {
      const userEvents = userEnrolls.map(({event}) => event)
      const matchEvents = matchEnrolls.map(({event}) => event)
      const eventsInCommon = userEvents.filter(event => matchEvents.includes(event.id))

      res.status(200).json(eventsInCommon)
    })
}

module.exports.like = (req, res, next) => {
  const params = { user: req.currentUser.id, userLiked: req.params.userId }
  const like = new Like(params)
  
  like.save()
    .then(like => res.status(201).json(like))
    .catch(next)
}

module.exports.dislike = (req, res, next) => {
  const params = { user: req.currentUser.id, userDisliked: req.params.id }
  const dislike = new Dislike(params)

  dislike.save()
    .then(dislike => res.status(201).json(dislike))
  .catch(next)
}