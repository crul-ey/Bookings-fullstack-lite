import express from 'express';
import authenticateToken from '../middleware/auth.js';
import {
  loginUser,
  getProfile,
  logoutUser,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/login', loginUser);
router.get('/profile', authenticateToken, getProfile);
router.post('/logout', logoutUser);

export default router;
