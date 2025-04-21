import prisma from "../../prisma/client.js";

//
// ✅ GET /amenities – alle voorzieningen ophalen
//
export const getAllAmenities = async (req, res) => {
  try {
    const amenities = await prisma.amenity.findMany({
      orderBy: { name: "asc" },
    });
    res.status(200).json(amenities);
  } catch (error) {
    console.error("❌ Error fetching amenities:", error);
    res.status(500).json({ error: "Interne serverfout bij ophalen voorzieningen" });
  }
};

//
// ✅ GET /amenities/:id – specifieke voorziening ophalen
//
export const getAmenityById = async (req, res) => {
  try {
    const amenity = await prisma.amenity.findUnique({
      where: { id: req.params.id },
    });

    if (!amenity) {
      return res.status(404).json({ error: "Voorziening niet gevonden" });
    }

    res.status(200).json(amenity);
  } catch (error) {
    console.error("❌ Error fetching amenity:", error);
    res.status(500).json({ error: "Interne serverfout bij ophalen voorziening" });
  }
};

//
// ✅ POST /amenities – nieuwe voorziening aanmaken
//
export const createAmenity = async (req, res) => {
  const { name, icon } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Naam van voorziening is verplicht" });
  }

  try {
    const exists = await prisma.amenity.findUnique({ where: { name } });
    if (exists) {
      return res.status(409).json({ error: "Deze voorziening bestaat al" });
    }

    const newAmenity = await prisma.amenity.create({
      data: {
        name,
        icon: icon || "", // optioneel, bijv. 🛁 of 📶
      },
    });

    res.status(201).json(newAmenity);
  } catch (error) {
    console.error("❌ Error creating amenity:", error);
    res.status(500).json({ error: "Interne serverfout bij aanmaken voorziening" });
  }
};

//
// ✅ PUT /amenities/:id – voorziening bijwerken
//
export const updateAmenity = async (req, res) => {
  const { name, icon } = req.body;

  try {
    const amenity = await prisma.amenity.findUnique({ where: { id: req.params.id } });
    if (!amenity) {
      return res.status(404).json({ error: "Voorziening niet gevonden" });
    }

    const updated = await prisma.amenity.update({
      where: { id: req.params.id },
      data: {
        name: name || amenity.name,
        icon: icon || amenity.icon,
      },
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error("❌ Error updating amenity:", error);
    res.status(500).json({ error: "Interne serverfout bij bijwerken voorziening" });
  }
};

//
// ✅ DELETE /amenities/:id – voorziening verwijderen
//
export const deleteAmenity = async (req, res) => {
  try {
    const amenity = await prisma.amenity.findUnique({ where: { id: req.params.id } });
    if (!amenity) {
      return res.status(404).json({ error: "Voorziening niet gevonden" });
    }

    await prisma.amenity.delete({ where: { id: req.params.id } });

    res.status(200).json({ message: "Voorziening succesvol verwijderd" });
  } catch (error) {
    console.error("❌ Error deleting amenity:", error);
    res.status(500).json({ error: "Interne serverfout bij verwijderen voorziening" });
  }
};
