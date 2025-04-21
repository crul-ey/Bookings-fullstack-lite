import jwt from "jsonwebtoken";

/**
 * ✅ Middleware: valideert JWT token en voegt `req.user` toe met ID, username en role
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Geen geldige Authorization header" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.AUTH_SECRET_KEY);
    req.user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
    };
    next();
  } catch (error) {
    console.error("❌ Token verificatie mislukt:", error);
    return res.status(403).json({ error: "Ongeldige of verlopen token" });
  }
};

export default authenticateToken;
