const prisma = require("../prisma/client");

/**
 * Create a new client
 */
exports.createClient = async (req, res) => {
  try {
    const { name, email, phone, type } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        message: "Client name and type are required",
      });
    }

    const client = await prisma.client.create({
      data: {
        name,
        email,
        phone,
        type,
      },
    });

    return res.status(201).json({
      message: "Client created successfully",
      data: client,
    });
  } catch (error) {
    console.error("Create Client Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get all clients
 */
exports.getAllClients = async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      data: clients,
    });
  } catch (error) {
    console.error("Get Clients Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get single client by ID
 */
exports.getClientById = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        events: true,
      },
    });

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    return res.status(200).json({
      data: client,
    });
  } catch (error) {
    console.error("Get Client Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Update client
 */
exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;

    const existingClient = await prisma.client.findUnique({
      where: { id },
    });

    if (!existingClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    const updatedClient = await prisma.client.update({
      where: { id },
      data: req.body,
    });

    return res.status(200).json({
      message: "Client updated successfully",
      data: updatedClient,
    });
  } catch (error) {
    console.error("Update Client Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Delete client
 */
exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    const existingClient = await prisma.client.findUnique({
      where: { id },
    });

    if (!existingClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    await prisma.client.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "Client deleted successfully",
    });
  } catch (error) {
    console.error("Delete Client Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
