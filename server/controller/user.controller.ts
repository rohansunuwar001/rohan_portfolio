import { Request, Response } from 'express';
import * as userService from '../services/user.service.js';

/**
 * Handle HTTP Request/Response for User Registration.
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const sanitizedUser = await userService.registerUser({ email, password, name });
    
    return res.status(201).json({
      message: 'User registered successfully',
      user: sanitizedUser,
    });
  } catch (error: any) {
    console.error('Registration controller error:', error);
    const status = error.message.includes('already exists') ? 400 : 500;
    return res.status(status).json({ error: error.message || 'Internal server error' });
  }
};

/**
 * Handle HTTP Request/Response for User Login.
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await userService.loginUser({ email, password });
    
    return res.status(200).json({
      message: 'Login successful',
      ...result,
    });
  } catch (error: any) {
    console.error('Login controller error:', error);
    const status = error.message.includes('Invalid') ? 401 : 500;
    return res.status(status).json({ error: error.message || 'Internal server error' });
  }
};
