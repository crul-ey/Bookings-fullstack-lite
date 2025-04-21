import prisma from "../../prisma/client.js";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

// ✅ GET /users?search=&role=
export const getAllUsers = async (req, res) => {
  try {
    const { username, email, role } = req.query;
    const filters = {};

    if (username) filters.username = { contains: username, mode: "insensitive" };
    if (email) filters.email = { contains: email, mode: "insensitive" };
    if (role) filters.role = role;

    const users = await prisma.user.findMany({
      where: filters,
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        phoneNumber: true,
        profilePicture: true,
        role: true,
        aboutMe: true,
        isBlocked: true,
        deletedAt: true,
      },
      orderBy: { username: "asc" },
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Fout bij ophalen gebruikers:", error);
    res.status(500).json({ error: "Er ging iets mis bij het ophalen van gebruikers." });
  }
};

// ✅ POST /users
export const createUser = async (req, res) => {
  try {
    const { username, password, name, email, phoneNumber, profilePicture, role, aboutMe } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ error: "Username, password en email zijn verplicht." });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        name,
        email,
        phoneNumber,
        profilePicture,
        role: role || "user",
        aboutMe,
      },
    });

    res.status(201).json({ id: newUser.id });
  } catch (error) {
    console.error("❌ Fout bij aanmaken gebruiker:", error);
    res.status(500).json({ error: "Gebruiker aanmaken mislukt." });
  }
};

// ✅ GET /users/:id
export const getUserById = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        phoneNumber: true,
        profilePicture: true,
        role: true,
        aboutMe: true,
      },
    });

    if (!user) return res.status(404).json({ error: "Gebruiker niet gevonden." });

    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Fout bij ophalen gebruiker:", error);
    res.status(500).json({ error: "Fout bij ophalen van gebruiker." });
  }
};

// ✅ GET /users/me
export const getProfileAsUser = async (req, res) => {
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
        role: true,
        aboutMe: true,
      },
    });
    if (!user) return res.status(404).json({ error: "Gebruiker niet gevonden." });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Fout bij ophalen eigen profiel." });
  }
};

// ✅ PUT /users/:id
export const updateUser = async (req, res) => {
  try {
    const { username, password, name, email, phoneNumber, profilePicture, role, aboutMe } = req.body;
    const data = { username, name, email, phoneNumber, profilePicture, role, aboutMe };
    if (password) data.password = await bcrypt.hash(password, SALT_ROUNDS);

    const updated = await prisma.user.update({ where: { id: req.params.id }, data });
    res.status(200).json(updated);
  } catch (error) {
    if (error.code === "P2025") {
      res.status(404).json({ error: "Gebruiker niet gevonden." });
    } else {
      console.error("❌ Fout bij bijwerken gebruiker:", error);
      res.status(500).json({ error: "Bijwerken mislukt." });
    }
  }
};

// ✅ PATCH /users/:id/role
export const updateUserRole = async (req, res) => {
  const { role } = req.body;
  if (!role || !["user", "host", "admin"].includes(role)) {
    return res.status(400).json({ error: "Ongeldige rol opgegeven." });
  }

  try {
    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { role },
    });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: "Fout bij wijzigen van rol." });
  }
};

// ✅ PATCH /users/:id/avatar
export const updateUserAvatar = async (req, res) => {
  const { profilePicture } = req.body;
  if (!profilePicture) return res.status(400).json({ error: "Geen avatar opgegeven." });

  try {
    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { profilePicture },
    });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: "Fout bij bijwerken avatar." });
  }
};

// ✅ DELETE /users/:id - hard delete
export const deleteUser = async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.status(200).json({ message: "Gebruiker verwijderd." });
  } catch (error) {
    if (error.code === "P2025") {
      res.status(404).json({ error: "Gebruiker niet gevonden." });
    } else {
      console.error("❌ Fout bij verwijderen gebruiker:", error);
      res.status(500).json({ error: "Verwijderen mislukt." });
    }
  }
};

// ✅ DELETE /users/:id/soft - soft delete
export const softDeleteUser = async (req, res) => {
  try {
    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { deletedAt: new Date() },
    });
    res.status(200).json({ message: "Soft delete toegepast.", user: updated });
  } catch (error) {
    res.status(500).json({ error: "Soft delete mislukt." });
  }
};

// ✅ PATCH /users/:id/block - block/unblock user
export const blockUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) return res.status(404).json({ error: "Gebruiker niet gevonden." });

    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { isBlocked: !user.isBlocked },
    });
    res.status(200).json({ message: updated.isBlocked ? "Gebruiker geblokkeerd." : "Gebruiker geactiveerd.", user: updated });
  } catch (error) {
    res.status(500).json({ error: "Blokkeren mislukt." });
  }
};

// ✅ GET /users/stats/general
export const getUserStats = async (req, res) => {
  try {
    const total = await prisma.user.count();
    const blocked = await prisma.user.count({ where: { isBlocked: true } });
    const hosts = await prisma.user.count({ where: { role: "host" } });
    const admins = await prisma.user.count({ where: { role: "admin" } });
    res.status(200).json({ total, blocked, hosts, admins });
  } catch (error) {
    res.status(500).json({ error: "Statistieken ophalen mislukt." });
  }
};

// ✅ GET /users/:id/full
export const getFullUserById = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        properties: true,
        bookings: true,
        reviews: true,
      },
    });
    if (!user) return res.status(404).json({ error: "Gebruiker niet gevonden." });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Volledige user ophalen mislukt." });
  }
};

// ✅ GET /users/hosts
export const getAllHosts = async (req, res) => {
  try {
    const hosts = await prisma.user.findMany({
      where: { role: "host" },
      select: {
        id: true,
        name: true,
        aboutMe: true,
        profilePicture: true,
      },
      orderBy: { name: "asc" },
    });
    res.status(200).json(hosts);
  } catch (error) {
    res.status(500).json({ error: "Kan hosts niet ophalen." });
  }
};
