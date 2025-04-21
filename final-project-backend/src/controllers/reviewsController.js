import prisma from "../../prisma/client.js";

//
// ✅ GET /reviews – alle reviews
//
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        property: { select: { id: true, title: true, location: true } },
      },
    });
    res.status(200).json(reviews);
  } catch (error) {
    console.error("❌ Error fetching reviews:", error);
    res.status(500).json({ error: "Interne serverfout" });
  }
};

//
// ✅ GET /reviews/:id – specifieke review
//
export const getReviewById = async (req, res) => {
  try {
    const review = await prisma.review.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        property: { select: { id: true, title: true, location: true } },
      },
    });

    if (!review) {
      return res.status(404).json({ error: "Review niet gevonden" });
    }

    res.status(200).json(review);
  } catch (error) {
    console.error("❌ Error fetching review by ID:", error);
    res.status(500).json({ error: "Interne serverfout" });
  }
};

//
// ✅ GET /reviews/user/:userId
//
export const getReviewsByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const reviews = await prisma.review.findMany({
      where: { userId },
      include: {
        property: { select: { id: true, title: true, location: true } },
      },
    });

    res.status(200).json(reviews);
  } catch (error) {
    console.error("❌ Error fetching reviews by user:", error);
    res.status(500).json({ error: "Fout bij ophalen reviews van gebruiker" });
  }
};

//
// ✅ GET /reviews/property/:propertyId
//
export const getReviewsByPropertyId = async (req, res) => {
  const { propertyId } = req.params;

  try {
    const reviews = await prisma.review.findMany({
      where: { propertyId },
      include: {
        user: { select: { id: true, name: true } },
      },
    });

    res.status(200).json(reviews);
  } catch (error) {
    console.error("❌ Error fetching reviews by property:", error);
    res.status(500).json({ error: "Fout bij ophalen reviews van woning" });
  }
};

//
// ✅ POST /reviews – nieuwe review aanmaken
//
export const createReview = async (req, res) => {
  try {
    const { propertyId, rating, comment } = req.body;

    if (!propertyId || !rating) {
      return res.status(400).json({ error: "propertyId en rating zijn verplicht" });
    }

    const newReview = await prisma.review.create({
      data: {
        userId: req.user.id,
        propertyId,
        rating: parseFloat(rating),
        comment,
      },
    });

    res.status(201).json({ id: newReview.id });
  } catch (error) {
    console.error("❌ Error creating review:", error);
    res.status(500).json({ error: "Interne serverfout bij aanmaken review" });
  }
};

//
// ✅ PUT /reviews/:id – review bijwerken
//
export const updateReview = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  try {
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) return res.status(404).json({ error: "Review niet gevonden" });

    if (req.user.id !== review.userId && req.user.role !== "admin") {
      return res.status(403).json({ error: "Geen toegang om deze review te bewerken" });
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        rating: rating ? parseFloat(rating) : undefined,
        comment,
      },
    });

    res.status(200).json(updatedReview);
  } catch (error) {
    console.error("❌ Error updating review:", error);
    res.status(500).json({ error: "Fout bij bijwerken van review" });
  }
};

//
// ✅ DELETE /reviews/:id – review verwijderen
//
export const deleteReview = async (req, res) => {
  const { id } = req.params;

  try {
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) return res.status(404).json({ error: "Review niet gevonden" });

    if (req.user.id !== review.userId && req.user.role !== "admin") {
      return res.status(403).json({ error: "Geen toegang om deze review te verwijderen" });
    }

    await prisma.review.delete({ where: { id } });

    res.status(200).json({ message: "Review succesvol verwijderd" });
  } catch (error) {
    console.error("❌ Error deleting review:", error);
    res.status(500).json({ error: "Fout bij verwijderen van review" });
  }
};
