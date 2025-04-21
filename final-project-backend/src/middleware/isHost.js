const isHost = (req, res, next) => {
    if (req.user?.role !== "host") {
      return res.status(403).json({ error: "Alleen hosts mogen dit doen" });
    }
    next();
  };
  
  export default isHost;
  