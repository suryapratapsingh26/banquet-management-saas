const prisma = require("../prisma/client");

const createVenue = async (req, res) => {
  try {
    const { name, description, capacity, location, baseRate, isActive } =
      req.body;

    if (!name || !capacity || !baseRate) {
      return res.status(400).json({
        message: "Venue name, capacity, and baseRate are required",
      });
    }

    const venue = await prisma.venue.create({
      data: {
        name,
        description,
        capacity: Number(capacity),
        location,
        baseRate: Number(baseRate),
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return res.status(201).json({
      message: "Venue created successfully",
      data: venue,
    });
  } catch (error) {
    console.error("Create Venue Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllVenues = async (req, res) => {
  try {
    const venues = await prisma.venue.findMany({
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ data: venues });
  } catch (error) {
    console.error("Get Venues Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getVenueById = async (req, res) => {
  try {
    const { id } = req.params;

    const venue = await prisma.venue.findUnique({
      where: { id },
      include: { events: true },
    });

    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    return res.status(200).json({ data: venue });
  } catch (error) {
    console.error("Get Venue Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateVenue = async (req, res) => {
  try {
    const { id } = req.params;

    const venue = await prisma.venue.update({
      where: { id },
      data: req.body,
    });

    return res.status(200).json({
      message: "Venue updated successfully",
      data: venue,
    });
  } catch (error) {
    console.error("Update Venue Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteVenue = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.venue.delete({ where: { id } });

    return res.status(200).json({
      message: "Venue deleted successfully",
    });
  } catch (error) {
    console.error("Delete Venue Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createVenue,
  getAllVenues,
  getVenueById,
  updateVenue,
  deleteVenue,
};
