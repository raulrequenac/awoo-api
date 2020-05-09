const express = require("express")
const router = express.Router()
const passport = require("passport")
const uploadCloud = require("../cloudinary.config")
const usersController = require("../../controllers/users.controller")
const matchesController = require("../../controllers/matches.controller")

router.get('/current', (req, res) => res.json(req.currentUser))
router.post(
  "/register",
  uploadCloud.array("images"),
  usersController.register
)
router.get("/validate/:validateToken", usersController.validate)
router.patch("/edit", usersController.edit)
router.post("/delete", usersController.delete)
router.post("/login", usersController.login)
router.get(
  "/login/google",
  passport.authenticate("google-auth", {
    scope: ["openid", "profile", "email"],
  })
)
router.get(
  "/login/facebook",
  passport.authenticate("facebook-auth", { scope: ["email"] })
)
router.get("/login/:provider/callback", usersController.socialLogin)
router.post("/logout", usersController.logout)

router.get("/matches", matchesController.getMatches)
router.get(
  "/matches/:userId/events-in-common",
  matchesController.eventsInCommon
)
router.post("/like/:userId", matchesController.like)
router.post("/dislike/:userId", matchesController.dislike)

module.exports = router