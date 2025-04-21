const isUser = (req, res, next) => {
    if (req.user?.role !== "user") {
      return res.status(403).json({ error: "Alleen ingelogde gebruikers mogen dit doen" });
    }
    next();
  };
  
  export default isUser;
  