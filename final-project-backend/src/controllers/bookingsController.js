import prisma from "../../prisma/client.js";

export const getAllBookings = async (req, res) => {
  try {
    const { id: requesterId, role } = req.user;

    let where = {};

    if (role === "user") {
      where.userId = requesterId;
    } else if (role === "host") {
      where = {
        property: {
          hostId: requesterId,
        },
      };
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        property: { select: { id: true, title: true, location: true, hostId: true } },
      },
    });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("❌ Error fetching bookings:", error);
    res.status(500).json({ error: "Interne serverfout bij ophalen van boekingen" });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: {
        user: true,
        property: { select: { id: true, title: true, location: true, hostId: true } },
      },
    });

    if (!booking) {
      return res.status(404).json({ error: "Boeking niet gevonden" });
    }

    const { id: userId, role } = req.user;
    const isOwner = booking.userId === userId;
    const isHost = booking.property.hostId === userId;

    if (!(role === "admin" || isOwner || isHost)) {
      return res.status(403).json({ error: "Geen toegang tot deze booking" });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error("❌ Error fetching booking by ID:", error);
    res.status(500).json({ error: "Interne serverfout" });
  }
};

export const getBookingsByUserId = async (req, res) => {
  try {
    const { role, id: requesterId } = req.user;
    const userId = req.params.userId;

    if (role !== "admin" && userId !== requesterId) {
      return res.status(403).json({ error: "Niet gemachtigd voor deze gebruiker" });
    }

    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: { property: true },
    });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Fout bij ophalen van boekingen van gebruiker" });
  }
};

export const getBookingsByPropertyId = async (req, res) => {
  try {
    const { role, id: requesterId } = req.user;
    const propertyId = req.params.propertyId;

    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) return res.status(404).json({ error: "Property niet gevonden" });

    if (role !== "admin" && property.hostId !== requesterId) {
      return res.status(403).json({ error: "Niet gemachtigd voor deze property" });
    }

    const bookings = await prisma.booking.findMany({
      where: { propertyId },
      include: { user: true },
    });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Fout bij ophalen van boekingen voor property" });
  }
};

export const createBooking = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({ error: "Alleen gebruikers kunnen een booking maken" });
    }

    const {
      propertyId,
      checkinDate,
      checkoutDate,
      numberOfGuests,
      totalPrice,
      bookingStatus,
    } = req.body;

    if (!propertyId || !checkinDate || !checkoutDate || !totalPrice || !numberOfGuests) {
      return res.status(400).json({ error: "Ontbrekende verplichte boekingsvelden" });
    }

    const newBooking = await prisma.booking.create({
      data: {
        userId: req.user.id,
        propertyId,
        checkinDate: new Date(checkinDate),
        checkoutDate: new Date(checkoutDate),
        numberOfGuests: parseInt(numberOfGuests),
        totalPrice: parseFloat(totalPrice),
        bookingStatus: bookingStatus || "confirmed",
      },
    });

    res.status(201).json({ id: newBooking.id });
  } catch (error) {
    console.error("❌ Error creating booking:", error);
    res.status(500).json({ error: "Interne serverfout bij het maken van de booking" });
  }
};

export const updateBooking = async (req, res) => {
  const { id } = req.params;
  const {
    checkinDate,
    checkoutDate,
    numberOfGuests,
    totalPrice,
    bookingStatus,
  } = req.body;

  try {
    const booking = await prisma.booking.findUnique({ where: { id } });

    if (!booking) {
      return res.status(404).json({ error: "Booking niet gevonden" });
    }

    const { id: userId, role } = req.user;
    const isOwner = booking.userId === userId;

    if (!(role === "admin" || isOwner)) {
      return res.status(403).json({ error: "Geen toestemming om deze booking te wijzigen" });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        checkinDate: checkinDate ? new Date(checkinDate) : undefined,
        checkoutDate: checkoutDate ? new Date(checkoutDate) : undefined,
        numberOfGuests: numberOfGuests ? parseInt(numberOfGuests) : undefined,
        totalPrice: totalPrice ? parseFloat(totalPrice) : undefined,
        bookingStatus: bookingStatus || undefined,
      },
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error("❌ Error updating booking:", error);
    res.status(500).json({ error: "Interne serverfout bij het bijwerken van de booking" });
  }
};

export const deleteBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await prisma.booking.findUnique({ where: { id } });

    if (!booking) {
      return res.status(404).json({ error: "Booking niet gevonden" });
    }

    const { id: userId, role } = req.user;
    const isOwner = booking.userId === userId;

    if (!(role === "admin" || isOwner)) {
      return res.status(403).json({ error: "Geen toestemming om deze booking te verwijderen" });
    }

    await prisma.booking.delete({ where: { id } });
    res.status(200).json({ message: "Booking succesvol verwijderd" });
  } catch (error) {
    console.error("❌ Error deleting booking:", error);
    res.status(500).json({ error: "Interne serverfout bij het verwijderen van de booking" });
  }
};
