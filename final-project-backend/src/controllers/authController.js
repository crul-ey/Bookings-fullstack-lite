import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import prisma from '../../prisma/client.js';

const JWT_SECRET = process.env.AUTH_SECRET_KEY;
const TOKEN_EXPIRY = '1h'; // ⏳ eventueel uitbreidbaar naar '7d' of refresh tokens

/**
 * 🔐 Login gebruiker
 */
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username en wachtwoord zijn verplicht' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return res.status(401).json({ error: 'Gebruiker niet gevonden' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Wachtwoord onjuist' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error('❌ Fout bij inloggen:', error);
    res.status(500).json({ error: 'Interne serverfout' });
  }
};

/**
 * 👤 Profiel ophalen
 */
export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        phoneNumber: true,
        profilePicture: true,
        aboutMe: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Gebruiker niet gevonden' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('❌ Fout bij ophalen profiel:', error);
    res.status(500).json({ error: 'Interne serverfout' });
  }
};

/**
 * 🚪 Uitloggen (optioneel - bij cookies relevant)
 */
export const logoutUser = (req, res) => {
  // Bij localStorage is dit client-only. Bij httpOnly cookie kun je deze gebruiken:
  // res.clearCookie('token');
  res.status(200).json({ message: 'Uitgelogd' });
};
