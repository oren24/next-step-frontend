import bcryptjs from 'bcryptjs';
import { BCRYPT_ROUNDS } from '../config/constants.js';

/**
 * Hash password
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
export const hashPassword = async (password) => {
  const salt = await bcryptjs.genSalt(BCRYPT_ROUNDS);
  return bcryptjs.hash(password, salt);
};

/**
 * Verify password
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} True if match
 */
export const verifyPassword = async (password, hash) => {
  return bcryptjs.compare(password, hash);
};

export default {
  hashPassword,
  verifyPassword,
};
