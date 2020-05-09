const express = require("express")
const router = express.Router()
const eventsController = require("../../controllers/events.controller")

router.post("/events/create", eventsController.create)
router.patch("/events/:eventId/edit", eventsController.edit)
router.post("/events/:eventId/delete", eventsController.delete)
router.post("/events/:eventId/enroll", eventsController.enroll)
router.get("/events/:eventId/enrolled", eventsController.getUsersEnrolled)

module.exports = router