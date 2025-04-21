import express from "express";
import authenticateToken from "../middleware/auth.js";
import isAdmin from "../middleware/isAdmin.js";
import isOwnerOrAdmin from "../middleware/isOwnerOrAdmin.js";

import {
  getAllUsers,
  getUserById,
  getProfileAsUser,
  createUser,
  updateUser,
  updateUserRole,
  updateUserAvatar,
  deleteUser,
  softDeleteUser,
  blockUser,
  getUserStats,
  getFullUserById,
  getAllHosts,
} from "../controllers/usersController.js";

const router = express.Router();

// 👥 GET /users/hosts - openbaar
router.get("/hosts", getAllHosts);

// 👤 GET /users/me - eigen profiel ophalen
router.get("/me", authenticateToken, getProfileAsUser);

// 📄 GET /users - admin-only + optionele filters
router.get("/", authenticateToken, isAdmin, getAllUsers);

// ➕ POST /users - admin-only
router.post("/", authenticateToken, isAdmin, createUser);

// 📄 GET /users/:id - alleen ingelogde gebruiker of admin
router.get("/:id", authenticateToken, getUserById);

// 🔁 PATCH /users/:id/role - admin only
router.patch("/:id/role", authenticateToken, isAdmin, updateUserRole);

// 🖼 PATCH /users/:id/avatar - eigen profiel of admin
router.patch("/:id/avatar", authenticateToken, isOwnerOrAdmin("id"), updateUserAvatar);

// ✏️ PUT /users/:id - profiel bijwerken
router.put("/:id", authenticateToken, isOwnerOrAdmin("id"), updateUser);

// 🧽 DELETE /users/:id/soft - soft delete
router.delete("/:id/soft", authenticateToken, isOwnerOrAdmin("id"), softDeleteUser);

// ❌ DELETE /users/:id - hard delete
router.delete("/:id", authenticateToken, isOwnerOrAdmin("id"), deleteUser);

// 🚫 PATCH /users/:id/block - admin blokkeert of activeert user
router.patch("/:id/block", authenticateToken, isAdmin, blockUser);

// 📊 GET /users/stats - admin statistieken
router.get("/stats/general", authenticateToken, isAdmin, getUserStats);

// 🧠 GET /users/:id/full - uitgebreide user info (admin)
router.get("/:id/full", authenticateToken, isAdmin, getFullUserById);

export default router;