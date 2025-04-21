// ✅ src/routes/properties.js - uitgebreid met filtering, status & eigen properties
import express from "express";
import authenticateToken from "../middleware/auth.js";
import isHost from "../middleware/isHost.js";
import isOwnerOrAdmin from "../middleware/isOwnerOrAdmin.js";

import {
  getAllProperties,
  getPropertyById,
  getMyProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  updatePropertyStatus,
} from "../controllers/propertiesController.js";

const router = express.Router();

// ✅ GET /properties - alle properties (met filters)
router.get("/", authenticateToken, getAllProperties);

// ✅ GET /properties/me - eigen properties van host
router.get("/me", authenticateToken, isHost, getMyProperties);

// ✅ GET /properties/:id - specifieke property bekijken
router.get("/:id", authenticateToken, getPropertyById);

// ✅ POST /properties - nieuwe property aanmaken (alleen host)
router.post("/", authenticateToken, isHost, createProperty);

// ✅ PUT /properties/:id - property bijwerken (owner/admin)
router.put("/:id", authenticateToken, isOwnerOrAdmin("id"), updateProperty);

// ✅ PATCH /properties/:id/status - status wijzigen (actief/inactief bijv.)
router.patch("/:id/status", authenticateToken, isOwnerOrAdmin("id"), updatePropertyStatus);

// ✅ DELETE /properties/:id - verwijderen van property (owner/admin)
router.delete("/:id", authenticateToken, isOwnerOrAdmin("id"), deleteProperty);

export default router;
