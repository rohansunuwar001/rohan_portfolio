import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/**
 * Hash a plain text password using bcrypt.
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

/**
 * Compare a plain text password against a bcrypt hash.
 */
export const comparePasswords = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * Generate a JSON Web Token for the user.
 */
export const generateToken = (userId: number): string => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: '24h' }
  );
};

/**
 * Sanitize a user object by removing sensitive data like the password.
 */
export const sanitizeUser = (user: any) => {
  if (!user) return null;
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
