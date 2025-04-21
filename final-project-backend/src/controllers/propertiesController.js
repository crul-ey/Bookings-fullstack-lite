import prisma from "../../prisma/client.js";

// ✅ GET /properties – met filtering & zichtbaarheid
export const getAllProperties = async (req, res) => {
  try {
    const {
      location,
      pricePerNight,
      amenities,
      hostId,
      includeDeleted = false,
    } = req.query;

    const filters = {
      deletedAt: includeDeleted === "true" ? undefined : null,
    };

    if (req.user.role !== "admin") {
      filters.isActive = true;
    }

    if (hostId) filters.hostId = hostId;
    if (location) filters.location = { contains: location, mode: "insensitive" };
    if (pricePerNight) filters.pricePerNight = { lte: parseFloat(pricePerNight) };

    const properties = await prisma.property.findMany({
      where: filters,
      include: {
        host: { select: { id: true, name: true, email: true, profilePicture: true } },
        amenities: {
          include: { amenity: { select: { id: true, name: true, icon: true } } },
        },
        bookings: { include: { user: { select: { name: true, email: true } } } },
        reviews: true,
      },
    });

    // Client-side filtering op amenities
    let filtered = properties;
    if (amenities) {
      const query = amenities.toLowerCase();
      filtered = properties.filter((property) =>
        property.amenities.some((a) =>
          a.amenity.name.toLowerCase().includes(query)
        )
      );
    }

    res.status(200).json(filtered);
  } catch (error) {
    console.error("\u274C Fout bij ophalen properties:", error);
    res.status(500).json({ error: "Interne serverfout" });
  }
};

// ✅ GET /properties/me – properties van ingelogde host
export const getMyProperties = async (req, res) => {
  try {
    const properties = await prisma.property.findMany({
      where: {
        hostId: req.user.id,
        deletedAt: null,
      },
      include: {
        amenities: {
          include: { amenity: { select: { id: true, name: true, icon: true } } },
        },
        bookings: { include: { user: true } },
        reviews: true,
      },
    });

    res.status(200).json(properties);
  } catch (error) {
    console.error("\u274C Fout bij ophalen eigen properties:", error);
    res.status(500).json({ error: "Interne serverfout" });
  }
};

// ✅ GET /properties/:id
export const getPropertyById = async (req, res) => {
  try {
    const property = await prisma.property.findUnique({
      where: { id: req.params.id },
      include: {
        host: { select: { id: true, name: true, email: true, profilePicture: true } },
        amenities: {
          include: { amenity: { select: { id: true, name: true, icon: true } } },
        },
        bookings: { include: { user: { select: { name: true, email: true } } } },
        reviews: true,
      },
    });

    if (!property || property.deletedAt) {
      return res.status(404).json({ error: "Property niet gevonden" });
    }

    res.status(200).json(property);
  } catch (error) {
    console.error("\u274C Fout bij ophalen property:", error);
    res.status(500).json({ error: "Interne serverfout" });
  }
};

// ✅ POST /properties – nieuwe property
export const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      pricePerNight,
      bedroomCount,
      bathRoomCount,
      maxGuestCount,
      rating,
      amenityIds = [],
    } = req.body;

    if (!title || !description || !location || !pricePerNight) {
      return res.status(400).json({ error: "Vul alle verplichte velden in" });
    }

    const newProperty = await prisma.property.create({
      data: {
        title,
        description,
        location,
        pricePerNight: parseFloat(pricePerNight),
        bedroomCount,
        bathRoomCount,
        maxGuestCount,
        rating,
        hostId: req.user.id,
        isActive: true,
        amenities: {
          create: amenityIds.map((amenityId) => ({ amenityId })),
        },
      },
    });

    res.status(201).json({ id: newProperty.id });
  } catch (error) {
    console.error("\u274C Fout bij aanmaken property:", error);
    res.status(500).json({ error: "Interne serverfout" });
  }
};

// ✅ PUT /properties/:id – property bijwerken
export const updateProperty = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    location,
    pricePerNight,
    bedroomCount,
    bathRoomCount,
    maxGuestCount,
    rating,
  } = req.body;

  try {
    const existing = await prisma.property.findUnique({ where: { id } });

    if (!existing || existing.deletedAt) {
      return res.status(404).json({ error: "Property niet gevonden" });
    }

    const updated = await prisma.property.update({
      where: { id },
      data: {
        title,
        description,
        location,
        pricePerNight: parseFloat(pricePerNight),
        bedroomCount,
        bathRoomCount,
        maxGuestCount,
        rating,
      },
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error("\u274C Fout bij bijwerken property:", error);
    res.status(500).json({ error: "Interne serverfout" });
  }
};

// ✅ PATCH /properties/:id/status – beschikbaarheid toggle
export const updatePropertyStatus = async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  try {
    const updated = await prisma.property.update({
      where: { id },
      data: { isActive: Boolean(isActive) },
    });

    res.status(200).json({ message: "Status bijgewerkt", property: updated });
  } catch (error) {
    console.error("\u274C Fout bij statuswijziging:", error);
    res.status(500).json({ error: "Status wijzigen mislukt" });
  }
};

// ✅ DELETE /properties/:id – soft delete
export const deleteProperty = async (req, res) => {
  const { id } = req.params;

  try {
    const property = await prisma.property.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    res.status(200).json({ message: "Property is soft deleted", property });
  } catch (error) {
    if (error.code === "P2025") {
      res.status(404).json({ error: "Property niet gevonden" });
    } else {
      console.error("\u274C Fout bij verwijderen property:", error);
      res.status(500).json({ error: "Interne serverfout" });
    }
  }
};
