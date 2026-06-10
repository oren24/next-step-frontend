import * as authDal from '../dal/authDal.js';
import { hashPassword, verifyPassword } from '../utils/passwordUtils.js';
import { generateToken } from '../utils/tokenUtils.js';
import { isValidEmail, isValidPassword } from '../utils/validators.js';
import { ConflictError, UnauthorizedError, ValidationError } from '../utils/errorHandler.js';

/**
 * Register new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} name - User name
 * @returns {Promise<Object>} User and token
 */
export const register = async (email, password, name) => {
  // Validation
  if (!isValidEmail(email)) {
    throw new ValidationError('Invalid email format');
  }
  
  if (!isValidPassword(password)) {
    throw new ValidationError('Password must be at least 6 characters');
  }
  
  if (!name || name.trim().length === 0) {
    throw new ValidationError('Name is required');
  }
  
  // Check if user exists
  const existingUser = await authDal.getUserByEmail(email);
  if (existingUser) {
    throw new ConflictError('User already exists with this email');
  }
  
  // Hash password
  const passwordHash = await hashPassword(password);
  
  // Create user
  const user = await authDal.createUser(email, passwordHash, name.trim());
  
  // Generate token
  const token = generateToken(user.id);
  
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      created_at: user.created_at,
    },
    token,
  };
};

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User and token
 */
export const login = async (email, password) => {
  // Validation
  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }
  
  // Get user by email
  const user = await authDal.getUserByEmail(email);
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }
  
  // Verify password
  const isPasswordValid = await verifyPassword(password, user.password_hash);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid email or password');
  }
  
  // Generate token
  const token = generateToken(user.id);
  
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    token,
  };
};

/**
 * OAuth Login (creates user if doesn't exist)
 * @param {string} email - User email
 * @param {string} name - User name
 * @returns {Promise<Object>} User and token
 */
export const oauthLogin = async (email, name) => {
  if (!email || !name) {
    throw new ValidationError('Email and name are required for OAuth');
  }

  let user = await authDal.getUserByEmail(email);

  if (!user) {
    // Generate a highly secure random password for OAuth users since they don't use it to log in
    const randomPassword = globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now();
    const passwordHash = await hashPassword(randomPassword);
    user = await authDal.createUser(email, passwordHash, name.trim());
  }

  const token = generateToken(user.id);

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    token,
  };
};

export default {
  register,
  login,
  oauthLogin,
};
