const express = require("express")
const router = express.Router()
const eventsController = require("../../controllers/events.controller")

router.post("/create", eventsController.create)
router.patch("/:eventId/edit", eventsController.edit)
router.post("/:eventId/delete", eventsController.delete)
router.post("/:eventId/enroll", eventsController.enroll)
router.get("/:eventId/enrolled", eventsController.getUsersEnrolled)

module.exports = router