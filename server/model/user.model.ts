import database from '../database/database.js';
import { RegisterInput } from '../schema/user.schema.js';

/**
 * Retrieve a user record from the database by email address.
 */
export const findUserByEmail = async (email: string) => {
  return database.user.findUnique({
    where: { email },
  });
};

/**
 * Retrieve a user record from the database by user ID.
 */
export const findUserById = async (id: number) => {
  return database.user.findUnique({
    where: { id },
  });
};

/**
 * Insert a new user record into the database.
 */
export const createUser = async (data: RegisterInput) => {
  return database.user.create({
    data,
  });
};
