import jwt from 'jsonwebtoken';

export function verifyToken(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Token não encontrado.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.id;
    console.log(payload);
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: 'Token inválido.' });
  }
}