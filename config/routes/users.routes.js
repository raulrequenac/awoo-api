const express = require("express")
const router = express.Router()
const passport = require("passport")
const uploadCloud = require("../cloudinary.config")
const usersController = require("../../controllers/users.controller")
const matchesController = require("../../controllers/matches.controller")

router.post(
  "/users/register",
  uploadCloud.array("images"),
  usersController.register
)
router.get("/users/validate/:validateToken", usersController.validate)
router.patch("/users/edit", usersController.edit)
router.post("/users/delete", usersController.delete)
router.post("/users/login", usersController.login)
router.get(
  "/users/login/google",
  passport.authenticate("google-auth", {
    scope: ["openid", "profile", "email"],
  })
)
router.post(
  "/users/login/facebook",
  passport.authenticate("facebook-auth", { scope: ["email"] })
)
router.get("/users/login/:provider/callback", usersController.socialLogin)
router.post("/users/logout", usersController.logout)

router.get("/users/matches", matchesController.getMatches)
router.get(
  "/users/matches/:userId/events-in-common",
  matchesController.eventsInCommon
)
router.post("/users/like/:userId", matchesController.like)
router.post("/users/dislike/:userId", matchesController.dislike)

module.exports = router