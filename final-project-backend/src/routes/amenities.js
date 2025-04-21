import express from "express";
import authenticateToken from "../middleware/auth.js";
import isAdmin from "../middleware/isAdmin.js";

import {
  getAllAmenities,
  getAmenityById,
  createAmenity,
  updateAmenity,
  deleteAmenity,
} from "../controllers/amenitiesController.js";

const router = express.Router();

// 📋 GET /amenities – iedereen mag voorzieningen bekijken
router.get("/", getAllAmenities);

// 📄 GET /amenities/:id – individuele voorziening bekijken
router.get("/:id", getAmenityById);

// ➕ POST /amenities – alleen admin mag toevoegen
router.post("/", authenticateToken, isAdmin, createAmenity);

// ✏️ PUT /amenities/:id – alleen admin mag bijwerken
router.put("/:id", authenticateToken, isAdmin, updateAmenity);

// ❌ DELETE /amenities/:id – alleen admin mag verwijderen
router.delete("/:id", authenticateToken, isAdmin, deleteAmenity);

export default router;
