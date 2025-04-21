import prisma from '../../prisma/client.js'; 


const isOwnerOrAdmin = (paramKey = 'id') => {
  return async (req, res, next) => {
    const { id: userId, role } = req.user;
    const resourceId = req.params[paramKey];

    if (role === 'admin') return next();

    try {
      const property = await prisma.property.findUnique({
        where: { id: resourceId },
        select: { hostId: true },
      });

      if (!property) {
        return res.status(404).json({ error: 'Property niet gevonden' });
      }

      if (property.hostId !== userId) {
        return res
          .status(403)
          .json({ error: 'Je bent geen eigenaar van deze property' });
      }

      next();
    } catch (err) {
      console.error('❌ Error in isOwnerOrAdmin middleware:', err);
      res.status(500).json({ error: 'Interne serverfout' });
    }
  };
};

export default isOwnerOrAdmin;
