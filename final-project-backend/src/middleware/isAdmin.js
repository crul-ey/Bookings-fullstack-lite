const isAdmin = (req, res, next) => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Alleen admins mogen dit doen" });
    }
    next();
  };
  
  export default isAdmin;
  