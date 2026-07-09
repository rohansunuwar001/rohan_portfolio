import * as userModel from '../model/user.model.js';
import * as userHelper from '../helper/user.helper.js';
import { RegisterInput, LoginInput } from '../schema/user.schema.js';

/**
 * Handle user registration business logic:
 * Checks email availability, hashes password, saves record, and returns sanitized user.
 */
export const registerUser = async (input: RegisterInput) => {
  const existingUser = await userModel.findUserByEmail(input.email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  const hashedPassword = await userHelper.hashPassword(input.password);
  
  const newUser = await userModel.createUser({
    email: input.email,
    password: hashedPassword,
    name: input.name,
  });

  return userHelper.sanitizeUser(newUser);
};

/**
 * Handle user login business logic:
 * Validates credentials, generates JWT token, and returns user details.
 */
export const loginUser = async (input: LoginInput) => {
  const user = await userModel.findUserByEmail(input.email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await userHelper.comparePasswords(input.password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  const token = userHelper.generateToken(user.id);
  const sanitizedUser = userHelper.sanitizeUser(user);

  return {
    user: sanitizedUser,
    token,
  };
};
