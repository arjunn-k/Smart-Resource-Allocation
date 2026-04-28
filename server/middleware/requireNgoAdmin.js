export default function requireNgoAdmin(req, res, next) {
  if (process.env.SKIP_NGO_ADMIN_AUTH === 'true') {
    return next();
  }

  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      message: 'Protected route. Add NGO Admin JWT middleware verification here.',
    });
  }

  // Placeholder for JWT verification and NGO admin role checks.
  next();
}
