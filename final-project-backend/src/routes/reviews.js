import express from "express";
import authenticateToken from "../middleware/auth.js";
import isUser from "../middleware/isUser.js";
import isOwnerOrAdmin from "../middleware/isOwnerOrAdmin.js";

import {
  getAllReviews,
  getReviewById,
  getReviewsByUserId,
  getReviewsByPropertyId,
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewsController.js";

const router = express.Router();

// 📋 GET /reviews – alle reviews (openbaar)
router.get("/", getAllReviews);

// 📄 GET /reviews/:id – specifieke review ophalen
router.get("/:id", getReviewById);

// 👤 GET /reviews/user/:userId – alle reviews van één gebruiker
router.get("/user/:userId", getReviewsByUserId);

// 🏠 GET /reviews/property/:propertyId – alle reviews van een property
router.get("/property/:propertyId", getReviewsByPropertyId);

// ➕ POST /reviews – alleen ingelogde users mogen review achterlaten
router.post("/", authenticateToken, isUser, createReview);

// ✏️ PUT /reviews/:id – alleen eigenaar of admin mag review bewerken
router.put("/:id", authenticateToken, isOwnerOrAdmin("id"), updateReview);

// ❌ DELETE /reviews/:id – alleen eigenaar of admin mag review verwijderen
router.delete("/:id", authenticateToken, isOwnerOrAdmin("id"), deleteReview);

export default router;
