import express from "express";
import authenticateToken from "../middleware/auth.js";
import isUser from "../middleware/isUser.js";

import {
  getAllBookings,
  getBookingById,
  getBookingsByUserId,
  getBookingsByPropertyId,
  createBooking,
  updateBooking,
  deleteBooking,
} from "../controllers/bookingsController.js";

const router = express.Router();

// 📋 GET /bookings – alle boekingen (admin ziet alles, host eigen, user eigen)
router.get("/", authenticateToken, getAllBookings);

// 📄 GET /bookings/:id – specifieke booking ophalen
router.get("/:id", authenticateToken, getBookingById);

// 👤 GET /bookings/user/:userId – boekingen van specifieke user
router.get("/user/:userId", authenticateToken, getBookingsByUserId);

// 🏠 GET /bookings/property/:propertyId – alle boekingen op een specifieke property
router.get("/property/:propertyId", authenticateToken, getBookingsByPropertyId);

// ➕ POST /bookings – alleen users mogen boeken
router.post("/", authenticateToken, isUser, createBooking);

// ✏️ PUT /bookings/:id – alleen owner of admin mag wijzigen (check in controller)
router.put("/:id", authenticateToken, updateBooking);

// ❌ DELETE /bookings/:id – alleen owner of admin mag verwijderen (check in controller)
router.delete("/:id", authenticateToken, deleteBooking);

export default router;
