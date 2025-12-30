const express = require("express");
const router = express.Router();

const {
  createVenue,
  getAllVenues,
  getVenueById,
  updateVenue,
  deleteVenue,
} = require("../controllers/venue.controller");

router.post("/", createVenue);
router.get("/", getAllVenues);
router.get("/:id", getVenueById);
router.put("/:id", updateVenue);
router.delete("/:id", deleteVenue);

module.exports = router;
