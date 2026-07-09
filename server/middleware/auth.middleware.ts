import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
  };
}

/**
 * Express middleware to authenticate and verify JWT request tokens.
 * Injects verified payload into `req.user`.
 */
export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback_secret'
    ) as { userId: number };

    req.user = { userId: decoded.userId };
    return next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};
